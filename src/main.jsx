// Main entry point for HealthMate Frontend
// React 18 with createRoot API

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Get the root element
const container = document.getElementById('root');

// Create root and render app
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


