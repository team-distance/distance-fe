import { useState } from 'react';
import { instance } from '../api/instance';

export const useFetchDistance = (roomId) => {
  const [distance, setDistance] = useState(-1);

  const fetchDistance = async () => {
    try {
      const distance = await instance.get(`/gps/distance/${roomId}`);
      const parseDistance = parseInt(distance.data.distance);
      setDistance(parseDistance);
    } catch (error) {
      console.log('error', error);
    }
  };
  fetchDistance();

  return distance;
};
