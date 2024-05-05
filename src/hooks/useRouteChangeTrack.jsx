import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const useRouteChangeTrack = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID;
    if (gaTrackingId) {
      ReactGA.initialize(gaTrackingId);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.set({ page: location.pathname });
      ReactGA.send('pageview');
    }
  }, [initialized, location]);
};

export default useRouteChangeTrack;
