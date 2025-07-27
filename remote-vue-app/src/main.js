// src/main.js
import './assets/main.css';
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

export function mount(el) {
  // If there’s already a Vue app here, unmount it first
  if (el.__vue_app__) {
    el.__vue_app__.unmount();
    el.innerHTML = '';
  }

  const app = createApp(App);
  // Stash the app instance so we can unmount later
  el.__vue_app__ = app;

  app.mount(el);
  return () => {
    app.unmount();
    delete el.__vue_app__;
  };
}

export default mount;

// Standalone auto-mount when running in isolation
const el = document.getElementById('app');
if (el) mount(el);
