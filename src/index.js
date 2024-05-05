import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AwsRumProvider } from 'aws-rum-react';

const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <AwsRumProvider
      allowCookies
      endpoint={process.env.REACT_APP_AWS_RUM_ENDPOINT}
      id={process.env.REACT_APP_AWS_RUM_ID}
      identityPoolId={process.env.REACT_APP_AWS_IDENTITY_POOL_ID}
      region="ap-northeast-2"
      sessionSampleRate={1}
      telemetries={['performance', 'errors', 'http']}
      version="1.0.0"
    >
      <RecoilRoot>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RecoilRoot>
    </AwsRumProvider>
  </React.StrictMode>
);
const root = createRoot(rootElement);
root.render(app);

// Performance monitoring
reportWebVitals();
