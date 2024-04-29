import { useEffect, useState } from 'react';
import { DISTANCE } from '../constants/location';
import { calculateDistanceInMeter } from '../utils/calculateDistanceInMeter';

const useGPS = (isLoggedIn) => {
  const [curLocation, setCurLocation] = useState({
    lat: 0,
    lng: 0,
    error: null,
  });

  const success = (position) => {
    const { latitude, longitude } = position.coords;

    setCurLocation((prev) => {
      console.log(
        '미터 차이: ',
        calculateDistanceInMeter(prev.lat, prev.lng, latitude, longitude)
      );

      if (
        calculateDistanceInMeter(prev.lat, prev.lng, latitude, longitude) >
        DISTANCE
      ) {
        return {
          ...prev,
          lat: latitude,
          lng: longitude,
          error: null,
        };
      }
      return prev; // 조건을 만족하지 않으면 상태를 변경하지 않음
    });
  };

  const error = () => {
    setCurLocation((prev) => ({
      ...prev,
      error: 'Unable to retrieve your location',
    }));
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setCurLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported',
      }));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const watcher = navigator.geolocation.watchPosition(success, error);
      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    console.log(curLocation);
  }, [curLocation]);

  return curLocation;
};

export default useGPS;
