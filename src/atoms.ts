import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Theme } from "../types";
import { getTheme } from "./helpers/Theme";
export type ButtonObject = {
  title: string;
  onPress?: Function;
};
export const isDarkModeAtom = atomWithStorage("@themeType", false);
export const appColorAtom = atomWithStorage("@appColor", "#0F3CF8FF");
// atomWithStorage get type is being weird
//@ts-ignore
export const themeAtom = atomWithStorage<Theme>("@appTheme", (get) => {
  const isDarkMode = get(isDarkModeAtom);
  const appColor = get(appColorAtom);
  return getTheme(appColor, isDarkMode);
});

export const userAtom = atomWithStorage("@userTheme", {
  name: "",
  isAuthenticated: false,
});

export const expensesAtom = atomWithStorage("@userExpenses", []);

export const alertAtom = atom({
  visible: false,
  title: "",
  message: "",
  buttons: [] as ButtonObject[],
});
