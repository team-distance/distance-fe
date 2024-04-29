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
    console.log('curLocation', curLocation.lat, curLocation.lng);
    console.log('newLocation', latitude, longitude);

    if (
      calculateDistanceInMeter(
        curLocation.lat,
        curLocation.lng,
        latitude,
        longitude
      ) > DISTANCE
    ) {
      setCurLocation((prev) => ({
        ...prev,
        lat: latitude,
        lng: longitude,
        error: null,
      }));
    }
  };

  const error = () => {
    setCurLocation({
      ...curLocation,
      error: 'Unable to retrieve your location',
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setCurLocation({
        ...curLocation,
        error: 'Geolocation is not supported',
      });
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const watcher = navigator.geolocation.watchPosition(success, error);
      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, [isLoggedIn]);

  return curLocation;
};

export default useGPS;
