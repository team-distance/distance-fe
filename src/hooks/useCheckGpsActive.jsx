import { useEffect, useState } from 'react';

export const useCheckGpsActive = () => {
  const [isGpsActive, setIsGpsActive] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => setIsGpsActive(true),
      () => setIsGpsActive(false)
    );
  }, []);

  return isGpsActive;
};
