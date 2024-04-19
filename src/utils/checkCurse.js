import { curseWords } from '../constants/curseWords';

export const checkCurse = (message) => {
  let isIncludingCurse = false;

  for (let curseWord of curseWords) {
    if (message.includes(curseWord)) {
      isIncludingCurse = true;
      break;
    }
  }

  return isIncludingCurse;
};
