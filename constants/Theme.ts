import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Colors } from './Colors';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: Colors.light.background,
    text: Colors.light.text,
    border: Colors.light.icon,
    notification: Colors.light.tint,
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: Colors.dark.background,
    text: Colors.dark.text,
    border: Colors.dark.icon,
    notification: Colors.dark.tint,
  },
};

export type Theme = typeof lightTheme; 