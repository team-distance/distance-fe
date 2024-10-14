import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AwsRumProvider } from 'aws-rum-react';
import ReactGA from 'react-ga4';
import GlobalModalContainer from './providers/GlobalModalContainer';
import GlobalToastContainer from './providers/GlobalToastContainer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID;

if (gaTrackingId) {
  ReactGA.initialize(gaTrackingId, { debug: true });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});
const rootElement = document.getElementById('root');

const app = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
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
            <GlobalToastContainer />
            <App />
            <GlobalModalContainer />
          </BrowserRouter>
        </RecoilRoot>
      </AwsRumProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
const root = createRoot(rootElement);
root.render(app);

// Performance monitoring
reportWebVitals();
