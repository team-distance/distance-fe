import { useRecoilValue } from 'recoil';
import { isLoggedInState } from '../store/auth';
import useGPS from './useGPS';

export const useCheckGpsActive = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const currentLocation = useGPS(isLoggedIn);

  if (!isLoggedIn) return;
  if (currentLocation.error) return false;
  else return true;
};
