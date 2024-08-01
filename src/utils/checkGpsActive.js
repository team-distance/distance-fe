import { isLoggedInState } from "../store/auth"

export const checkGpsActive = () => {

    const isLoggedIn = useRecoilValue(isLoggedInState);
    const currentLocation = useGPS(isLoggedIn);

    if (!isLoggedInState) return;
    if (currentLocation.error) return false;
}