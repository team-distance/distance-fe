import { atom } from 'recoil';

export const matchingConfigState = atom({
  key: 'matchingConfigState',
  default: {
    isPermitOtherSchool: false,
    searchRange: 1000,
  },
});
