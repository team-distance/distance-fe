import { atom } from "recoil";
import { defaultInstance } from "../api/instance";

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: localStorage.getItem("token") ? true : false,
});

export const login = async (value) => {
  const response = await defaultInstance.post("/login", {
    loginId: value.id,
    password: value.password,
    clientToken: localStorage.getItem("clientToken"),
  });

  const { token } = response.data;

  localStorage.setItem("token", token);
};
