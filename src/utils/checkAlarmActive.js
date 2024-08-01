import { isLoggedInState } from "../store/auth"

export const checkAlarmActive = () => {

    if(!isLoggedInState) return;
    if('Notification' in window && Notification.permission !== 'granted') return false;
}
