import { atom } from "recoil";

export const registerDataState = atom({
  key: "registerDataState",
  default: {
    telNum: "",
    password: "",
    checkPassword: "",
    gender: "",
    department: "",
    mbti: "",
    memberCharacter: "",
    memberTagDto: [],
    memberHobbyDto: [],

    school: "",
    college: "",
    schoolEmail: "",
    
    agreeTerms: false,
    agreePrivacy: false,
  },
});
