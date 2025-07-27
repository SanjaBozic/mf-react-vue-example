// config/webpackDevServer.config.js
'use strict';
const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopSW = require('react-dev-utils/noopServiceWorkerMiddleware');
const paths = require('./paths');
const getHttps = require('./getHttpsConfig');

module.exports = function (proxy, allowedHost) {
  const disableFirewall =
    !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';

  // build v5 server config—https if getHttps() returns settings, otherwise plain http
  const httpsConfig = getHttps();
  const server = httpsConfig
    ? {
        type: 'https',
        options: httpsConfig,
      }
    : { type: 'http' };

  return {
    static: {
      directory: paths.appPublic,
      publicPath: paths.publicUrlOrPath,
      watch: {
        ignored: /node_modules/,
      },
    },

    client: {
      logging: 'none',
      overlay: { errors: true, warnings: false },
      webSocketURL: {
        hostname: process.env.WDS_SOCKET_HOST,
        pathname: process.env.WDS_SOCKET_PATH,
        port: process.env.WDS_SOCKET_PORT,
      },
    },

    compress: true,

    allowedHosts: disableFirewall ? 'all' : [allowedHost],

    headers: {
      'Access-Control-Allow-Origin': '*',
    },

    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,

    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },

    proxy,

    devMiddleware: {
      // strip trailing slash for webpack-dev-middleware
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },

    server,

    setupMiddlewares: (middlewares, devServer) => {
      // before any other middleware
      devServer.app.use(evalSourceMapMiddleware(devServer));
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }

      // after everything else, register noop service worker
      middlewares.push({
        name: 'noop-service-worker',
        middleware: noopSW(paths.publicUrlOrPath),
      });

      return middlewares;
    },
  };
};
