import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './styles/globals.css';
import './i18n';

// Initialize auth store when app starts
import { useAuthStore } from './store/authStore';

// Initialize authentication
useAuthStore.getState().initAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
