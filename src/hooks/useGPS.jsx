import { useEffect, useState } from 'react';
import { DISTANCE } from '../constants/location';
import { calculateDistanceInMeter } from '../utils/calculateDistanceInMeter';

/**
 * Geolocation API로 실시간 위치를 받아오는 커스텀 훅입니다.
 * 로그인 상태가 true일 때만 작동합니다.
 * @param {*} isLoggedIn - 로그인 상태
 * @returns {object} 현재 위도와 경도를 담은 객체
 */
const useGPS = (isLoggedIn) => {
  const [curLocation, setCurLocation] = useState({
    lat: 0,
    lng: 0,
    error: null,
  });

  const success = (position) => {
    const { latitude, longitude } = position.coords;

    setCurLocation((prev) => {
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

  return curLocation;
};

export default useGPS;
