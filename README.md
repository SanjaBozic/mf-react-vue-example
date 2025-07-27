# mf-react-vue-example
Module Federation - React.js host with two remote: React.js and Vue.js

Screenshot of the host with two remotes:

<img width="1490" height="648" alt="image" src="https://github.com/user-attachments/assets/50e606fb-b8ee-4318-97f8-c4520044ac9b" />

Here’s a cleaner, more engaging version of your README that improves structure, readability, and flow—while keeping all the great details intact:

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

Open your browser at [http://localhost:8080](http://localhost:8080) — the React host will render components from both remote applications.

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

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Webpack Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- The micro-frontend community for inspiring modern frontend modularity
