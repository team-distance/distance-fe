import { atom } from "recoil";

export const myDataState = atom({
  key: "myData",
  default: {
    mbti: "",
    memberCharacter: "",
    department: "",
    memberTagDto: [],
    memberHobbyDto: [],
  },
});
