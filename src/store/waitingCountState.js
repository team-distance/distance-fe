import { atom } from 'recoil';

export const waitingCountState = atom({
  key: 'waitingCountState',
  default: 0,
});
