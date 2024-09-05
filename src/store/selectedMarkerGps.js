import { atom } from 'recoil';

export const selectedMarkerGps = atom({
  key: 'selectedMarkerGps',
  default: {
    latitude: 0,
    longitude: 0,
  },
});
