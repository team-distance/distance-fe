import { useEffect, useState } from "react";
import { DISTANCE } from "../constants/location";
import { calculateDistanceInMeter } from "../utils/calculateDistanceInMeter";

/**
 * GPS를 사용하여 현재 위치를 반환하는 hook
 * @returns {Object} curLocation 현재 위치 정보
 */
const useGPS = () => {
  const [curLocation, setCurLocation] = useState({
    lat: 0,
    lng: 0,
    error: null,
  });

  const success = (position) => {
    const { latitude, longitude } = position.coords;

    if (
      calculateDistanceInMeter(
        curLocation.lat,
        curLocation.lng,
        latitude,
        longitude
      ) > DISTANCE
    ) {
      setCurLocation({
        lat: latitude,
        lng: longitude,
        error: null,
      });
    }
  };

  const error = () => {
    setCurLocation({
      ...curLocation,
      error: "Unable to retrieve your location",
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setCurLocation({
        ...curLocation,
        error: "Geolocation is not supported",
      });
    } else {
      const watcher = navigator.geolocation.watchPosition(success, error);

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  return curLocation;
};

export default useGPS;
