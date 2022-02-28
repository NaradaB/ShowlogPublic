import { atom } from "recoil";

export const currentShow = atom({
  key: "currentShow",
  default: null,
});

export const reviewWindow = atom({
  key: "reviewWindow",
  default: false,
});
