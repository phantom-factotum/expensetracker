import { colorManipulators, colorSchemes } from "@phantom-factotum/colorutils";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import {
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from "react-native-paper";

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);
const { alterHSVByRatio, lightenColor, darkenColor, setColorOpacity } =
  colorManipulators;
export const getTheme = (color: string, isDarkMode: boolean) => {
  const [primary, accent, ...otherColors] =
    colorSchemes.getNeutralScheme(color);
  const colorPresets = isDarkMode ? darkenColorPresets : lightenColorPresets;
  const primaryPresets = colorPresets(primary);
  const accentPresets = colorPresets(accent);
  const DefaultTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary,
      accent,
      primaryPresets,
      accentPresets,
      otherColors,
    },
  };

  if (isDarkMode) {
    const background = colorManipulators.blend(primary, "#000", 0.5);
    theme.colors.background = background;
    theme.colors.text = colorManipulators.blend(background, "#fff", 0.8);
  }
  return theme;
};

type ColorShadingFunction = (color: string) => string[];

export const lightenColorPresets: ColorShadingFunction = (color) => {
  return [
    alterHSVByRatio(color, { h: -0.01, s: -0.04, v: -0.1 }),
    lightenColor(alterHSVByRatio(color, { h: -0.01, s: 0.6, v: 0.6 }), 0.15),
    lightenColor(color, 0.25),
    lightenColor(color, 0.5),
  ];
};
export const darkenColorPresets: ColorShadingFunction = (color) => {
  return [
    alterHSVByRatio(color, { h: -0.01, s: 0.4, v: -0.4 }),
    darkenColor(alterHSVByRatio(color, { h: -0.01, s: 0.6, v: 0.6 }), 0.15),
    darkenColor(color, 0.25),
    darkenColor(color, 0.5),
  ];
};
