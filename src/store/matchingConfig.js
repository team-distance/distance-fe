import { atom } from 'recoil';

export const matchingConfigState = atom({
  key: 'matchingConfigState',
  default: {
    isPermitOtherSchool: false,
    searchRange: 500000,
    // searchRange: 1000,
  },
});
