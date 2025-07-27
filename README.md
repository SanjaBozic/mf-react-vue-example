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
- **Clear Configuration**: `webpack.config.js` files in each project.

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

## 🙏 Acknowledgments

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- The micro-frontend community for inspiring modern frontend modularity
