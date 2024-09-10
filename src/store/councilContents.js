import { atom } from 'recoil';

export const schoolState = atom({
  key: 'schoolState',
  default: '',
});

export const councilContentsState = atom({
  key: 'councilContentsState',
  default: [],
});

export const schoolQueryState = atom({
  key: 'schoolQueryState',
  default: '',
});
