import { atom } from "recoil";
import { instance } from "../api/instance";

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: localStorage.getItem("token") ? true : false,
});

export const login = async (value) => {
  const response = await instance.post("/login", {
    telNum: value.telNum,
    password: value.password,
    clientToken: value.clientToken,
  });

  const { token } = response.data;

  localStorage.setItem("token", token);
};
