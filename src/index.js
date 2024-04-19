import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
const root = createRoot(rootElement);
root.render(app);

// Performance monitoring
reportWebVitals();
