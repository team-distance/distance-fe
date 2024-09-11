import { useEffect, useState } from 'react';

export const useCheckAlarmActive = () => {
  const [isAlarmActive, setIsAlarmActive] = useState(true);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      setIsAlarmActive(false);
    } else {
      setIsAlarmActive(true);
    }
  }, []);

  return isAlarmActive;
};
