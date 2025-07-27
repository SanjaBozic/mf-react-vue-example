# mf-react-vue-example
Module Federation - React.js host with two remote: React.js and Vue.js

Screenshot of the host with two remotes:

<img width="1490" height="648" alt="image" src="https://github.com/user-attachments/assets/50e606fb-b8ee-4318-97f8-c4520044ac9b" />


---

# 🚀 Module Federation Example: React Host with React & Vue Remotes

This repository demonstrates a practical implementation of **Webpack 5’s Module Federation**, showcasing how a React.js host application can seamlessly consume modules from two remote applications—one built with React.js and another with Vue.js.

This setup illustrates the flexibility of cross-framework integration within a modern micro-frontend architecture.

---

## 🌟 Features

- **React.js Host**: Main application that dynamically imports modules from remote apps.
- **React Remote App**: Federated React.js application exposing components to the host.
- **Vue Remote App**: Federated Vue.js application exposing components to the host.
- **Webpack 5 Module Federation**: Built-in support for sharing modules at runtime.
- **Cross-Framework Integration**: React and Vue playing nicely in a single ecosystem.
- **Clear Configuration**: `webpack.config.js` files in each React project and `vue.config.cjs` file in Vue project.

---

## 🛠 Technologies Used

- Webpack 5  
- React.js  
- Vue.js  
- Node.js  
- npm

---

## 📋 Prerequisites

Make sure you have the following installed:

- [Node.js (LTS recommended)](https://nodejs.org/)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)

---

## 🚀 Installation & Setup

### Clone the repository

```bash
git clone https://github.com/SanjaBozic/mf-react-vue-example.git
cd mf-react-vue-example
```

### Install dependencies for each app

This repo includes three separate applications. Install them one by one:

```bash
# Host App
cd host-app
npm install
cd ..

# React Remote App
cd remote-react-app
npm install
cd ..

# Vue Remote App
cd remote-vue-app
npm install
cd ..
```

---

## 🏃 Running the Applications

Start all three applications. **Important**: Start the remotes _before_ the host.

### React Remote (Port 3001)

```bash
cd remote-react-app
PORT=3001 npm start 
```

### Vue Remote (Port 3002)

```bash
cd remote-vue-app
PORT=3002 npm run serve
```
or (same)
```bash
cd remote-vue-app
npm run serve
```

### React Host (Port 3000)

```bash
cd host-app
PORT=3000 npm start
```

Open your browser at [http://localhost:3000](http://localhost:3000) — the React host will render components from both remote applications.

---

## 📂 Project Structure

```
mf-react-vue-example/
├── host-app/
│   ├── public/
│   ├── config/
│   │   ├── webpack.config.js
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── VueRemote.jsx
│   ├── package.json
├── remote-react-app/
│   ├── public/
│   ├── config/
│   │   ├── webpack.config.js
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
└── remote-vue-app/
    ├── public/
    ├── src/
    │   ├── App.vue
    │   ├── main.js
    │   └── components/
    ├── package.json
    └── vue.config.cjs
```
---
# Vue specific code

## Integrating Vue Remote in a React Host via Wrapper Component

To enable cross-framework integration between a **Vue.js remote** and a **React.js host**, a wrapper component is implemented to manage rendering and lifecycle behavior. React cannot directly interpret Vue components, so the solution involves dynamically mounting the Vue application inside a DOM node controlled by React.

In this project, I achieved that using the following React component:

```jsx
// VueRemote.jsx
import React, { useLayoutEffect, useRef } from 'react';

export default function VueRemote() {
  const elRef = useRef(null);

  useLayoutEffect(() => {
    let unmountVue;
    (async () => {
      const mod = await import('remoteVue/App');
      const mount = mod.default || mod.mount;
      unmountVue = mount(elRef.current);
    })();
    return () => unmountVue?.();
  }, []);

  return <div ref={elRef} />;
}
```

### How It Works:

- **Dynamic Import**: Loads the Vue remote application using Module Federation (`remoteVue/App`).
- **Mount Function**: The Vue app exposes a `mount()` function that attaches the Vue component tree to the provided DOM element.
- **Ref Handling**: The `ref` (`elRef`) supplies a target DOM node that Vue uses as its mounting point.
- **Lifecycle Management**: When the React component unmounts, the Vue application is also cleanly unmounted to prevent memory leaks or orphaned DOM nodes.

This wrapper enables smooth interoperability between frameworks while preserving modularity and maintaining full control over lifecycle management.

---

## Why I Created `vue.config.cjs` for Module Federation

Vue CLI abstracts away Webpack configuration, which makes it convenient for most projects—but it also limits direct access to Webpack internals. Since Webpack Module Federation requires explicit configuration of plugins, output paths, and shared dependencies, we needed a way to inject these settings into the Vue CLI build process.

The solution is to use the vue.config.cjs file, which Vue CLI automatically reads and merges into its internal Webpack setup. This file allows us to:

    ✅ Enable Webpack 5, which is required for Module Federation

    ✅ Configure the ModuleFederationPlugin to expose Vue components

    ✅ Set the correct publicPath for dynamic loading

    ✅ Disable splitChunks to ensure remote modules are bundled properly

    ✅ Allow cross-origin requests from the host app

    ✅ Share Vue as a singleton to avoid multiple instances

### Code explanation

```cjs
// vue.config.cjs

const { dependencies: deps } = require('./package.json');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  // Disable runtime compiler for performance
  runtimeCompiler: false,

  // Tell Vue CLI to use Webpack 5
  pluginOptions: {
    webpack5: {}
  },

  // Let Webpack determine the public path dynamically
  publicPath: 'auto',

  // Dev server configuration
  devServer: {
    port: 3002, // Port for the Vue remote app
    headers: {
      'Access-Control-Allow-Origin': '*' // Allow host app to fetch modules
    }
  },

  // Extend Webpack configuration
  configureWebpack: {
    output: {
      publicPath: 'auto' // Required for Module Federation to resolve URLs
    },
    optimization: {
      splitChunks: false // Prevent code splitting to keep remoteEntry.js intact
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'remoteVue', // Unique name for the remote
        filename: 'remoteEntry.js', // Entry file exposed to host
        exposes: {
          './App': './src/main.js' // Expose the Vue app's entry point
        },
        shared: {
          vue: {
            singleton: true, // Ensure only one Vue instance is loaded
            eager: true,     // Load Vue immediately to avoid async issues
            requiredVersion: deps.vue // Match host's Vue version
          }
        }
      })
    ]
  }
};

```

---

# React specific code

## Eject

When using Create React App (CRA), much of the tooling—including the Webpack configuration—is abstracted away to simplify setup for developers. While that’s great for quick projects and clean conventions, it becomes limiting when you need **fine-grained control**—especially for advanced use cases like **Webpack Module Federation**.

Module Federation requires explicit configuration via `webpack.config.js`, such as setting `ModuleFederationPlugin`, customizing `publicPath`, and managing shared dependencies. Since CRA doesn't expose the Webpack config by default, the only way to unlock that flexibility is to **eject** the project.

### What Ejecting Does

Running `npm run eject` in a CRA project:

- Reveals the full Webpack configuration used under the hood
- Exposes Babel, ESLint, and other toolchain settings
- Gives you the freedom to modify Webpack plugins and loaders directly

After ejecting, I was able to integrate the `ModuleFederationPlugin` into the host’s config and tailor the build process to consume remote modules dynamically.

It’s a one-way decision, but for cases like this—where you’re orchestrating micro-frontends across frameworks—it’s practically a necessity.

## Webpack config Host

To enable **Module Federation** in the React host application, it was necessary to manually add the `ModuleFederationPlugin` to the Webpack configuration—something not exposed by default in Create React App (CRA), which is why you had to eject.

Once the config was accessible, this line was used to bring in the plugin directly from Webpack:

```js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
```

Since module federation involves sharing libraries between the host and remotes, the shared dependency versions needed to be synchronized. That’s why you imported them straight from the host’s `package.json`:

```js
const { dependencies } = require('../package.json');
```

Then, you defined the federation setup:

```js
new ModuleFederationPlugin({
  name: 'host', // Unique name for the host app
  remotes: {
    remoteReact: 'remoteReact@http://localhost:3001/remoteEntry.js',
    remoteVue: 'remoteVue@http://localhost:3002/remoteEntry.js',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: dependencies.react,
      eager: true
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
      eager: true
    },
    vue: {
      singleton: true,
      requiredVersion: dependencies.vue,
      eager: true
    }
  }
})
```

### What This Configuration Achieves:

- **Remotes Defined**: Tells the host where to fetch federated bundles from `remoteReact` and `remoteVue`.
- **Shared Dependencies**: Ensures `react`, `react-dom`, and `vue` are treated as singletons to avoid version conflicts and duplicate loading across apps.
- **Eager Loading**: Loads shared dependencies immediately, which helps prevent async edge cases during app initialization.

## Webpack config Remote

This config declares `remoteReact` as a federated **remote** that exposes part of its codebase to other applications (like a host).

```js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { dependencies } = require('../package.json');

new ModuleFederationPlugin({
  name: 'remoteReact',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App', // Makes the App component available to hosts
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: dependencies.react,
      eager: true,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
      eager: true,
    },
  }
})
```

### Key Points

- **`name: 'remoteReact'`**  
  This identifier is used by hosts to reference and consume modules from this remote.

- **`filename: 'remoteEntry.js'`**  
  The generated federated entry point that hosts will fetch when mounting remote components. It’s essentially the bundle gateway.

- **`exposes`**  
  Specifies what the remote makes available. In this case, the `App` component is exposed via `'./App'`, which points to `'./src/App'`.

- **`shared`**  
  Ensures `react` and `react-dom` are singleton instances and that both apps (host and remote) use the same versions to avoid duplication or mismatches.  
  The **`eager: true`** flag instructs Webpack to load these shared modules up front during the initialization phase.

## Notes for everyone who is coding 

Add the ModuleFederationPlugin after the HtmlWebpackPlugin in the webpack.config.js.

---

# Lazy loading

## Lazy Loading with `React.lazy`

The following lines dynamically load components at runtime:

```js
const RemoteReactApp = lazy(() => import('remoteReact/App'));
const RemoteVueApp = lazy(() => import('./VueRemote'));
```

- `React.lazy()` defers loading of these modules until they’re actually rendered.
- `remoteReact/App` refers to a federated module exposed by the React remote application via Webpack Module Federation.
- `./VueRemote` is a local wrapper component that bootstraps the Vue remote app inside a React-managed DOM node.

### Suspense Boundaries

```jsx
<Suspense fallback="Loading React remote…">
  <RemoteReactApp />
</Suspense>

<Suspense fallback="Loading Vue remote…">
  <RemoteVueApp />
</Suspense>
```

- **`Suspense`** handles the time window during which the lazy-loaded modules are being fetched and rendered.
- The `fallback` string provides a temporary UI (loading message) until the module is ready.
- Each remote component has its own boundary, which ensures isolated loading behavior and better user experience.

### Why It’s Useful

- **Performance Optimization**: Large remote apps aren’t bundled upfront—they’re only loaded when needed.
- **Decoupled Architecture**: Keeps host and remote apps loosely coupled, while maintaining smooth UX.
- **Framework Agnostic Integration**: Vue and React are loaded independently, with their own wrappers, yet rendered side by side.

---

# Info

I did have additional issues with the webpackDevServer in which I had to make a few changes. On host and remote React.js. - just a note for everyone who wants to do their own project with Module Federation.
