import { atom } from 'recoil';
import { instance } from '../api/instance';
import axios from 'axios';
import { baseURL } from '../constants/baseURL';

export const isLoggedInState = atom({
  key: 'isLoggedInState',
  default: localStorage.getItem('refreshToken') ? true : false,
});

export const login = async (value) => {
  const response = await instance.post('/login', {
    telNum: value.telNum,
    password: value.password,
    clientToken: value.clientToken,
  });

  const { accessToken, refreshToken } = response.data;

  localStorage.setItem('isFirstLogin', 'true');
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const refresh = async (value) => {
  const response = await axios.post(`${baseURL}/refresh`, {
    refreshToken: value.refreshToken,
  });

  const { accessToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
};
