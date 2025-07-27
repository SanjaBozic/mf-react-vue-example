// vue.config.cjs
const { dependencies: deps } = require('./package.json');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  runtimeCompiler: false,
  pluginOptions: {
    webpack5: {}    // tells Vue CLI to switch to webpack5
  },
  publicPath: 'auto',
  devServer: {
    port: 3002,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  configureWebpack: {
    output: { publicPath: 'auto' },
    optimization: {
      splitChunks: false,
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'remoteVue',
        filename: 'remoteEntry.js',
        exposes: { './App': './src/main.js' },
        shared: {
          vue: {
            singleton: true,
            eager: true,
            requiredVersion: deps.vue
          }
        }
      })
    ]
  }
};
