import { atom } from 'recoil';

export const bottomsheetState = atom({
  key: 'bottomsheetState',
  default: window.innerHeight / 2,
});
