import { instance } from '../api/instance';
import { useQuery } from '@tanstack/react-query';

export const useFetchDistance = (roomId) => {
  const { data: distance } = useQuery({
    queryKey: ['distance', roomId],
    queryFn: () =>
      instance
        .get(`/gps/distance/${roomId}`)
        .then((res) => res.data)
        .then((data) => parseInt(data.distance)),
    initialData: -1,
    staleTime: Infinity,
  });

  return distance;
};
