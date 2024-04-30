import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
const root = createRoot(rootElement);
root.render(app);

// Performance monitoring
reportWebVitals();
