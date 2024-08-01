import { isLoggedInState } from "../store/auth"

export const useCheckAlarmActive = () => {

    if(!isLoggedInState) return;
    if('Notification' in window && Notification.permission !== 'granted') return false;
    else return true;
}
