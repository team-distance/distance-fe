import { useRecoilValue } from 'recoil';
import { isLoggedInState } from '../store/auth';

export const useCheckAlarmActive = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  if (!isLoggedIn) return;
  if ('Notification' in window && Notification.permission !== 'granted')
    return false;
  else return true;
};
