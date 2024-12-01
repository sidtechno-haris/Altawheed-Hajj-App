import { create } from "zustand";

export const useGlobalState = create((set) => ({
  token: null,
  language: null,
  login: null,
  cordinate: null,
  address: null,
  groupId: null,

  setGroupId: (state) => {
    set(() => ({
      groupId: state,
    }));
  },
  setAddress: (state) => {
    set(() => ({
      address: state,
    }));
  },
  setCordinate: (state) => {
    set(() => ({
      cordinate: state,
    }));
  },
  setLogin: (state) => {
    set(() => ({
      login: state,
    }));
  },
  setToken: (state) => {
    set(() => ({
      token: state,
    }));
  },
  setLanguage: (state) => {
    set(() => ({
      language: state,
    }));
  },
}));
