import { atom } from 'recoil';

export const registerDataState = atom({
  key: 'registerDataState',
  default: {
    telNum: '',
    verifyNum: '',
    password: '',
    gender: '',
    school: '',
    college: '',
    department: '',
    mbti: '',
    memberCharacter: '',
    memberTagDto: [],
    memberHobbyDto: [],
    agreeTerms: false,
    agreePrivacy: false,
  },
});
