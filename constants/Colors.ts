/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useColorScheme } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export const Colors = {
    light: {
        text: '#11181C',
        background: '#fff',
        backgroundColored: '#000',
        textOnColored: '#fff',
        primaryButtoneInverted: '#000',
        textPrimaryInverted: '#000',
        secondaryButtoneInverted: '#383d41',
        textSecondaryInverted: '#fff',
        primary: '#000',
        primaryLight: '#e3e3e3',
        border: '#ccc',
        card: '#fff',
        notification: '#000',
        tint: tintColorLight,
        icon: '#000',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        error: '#FF3B30',
    },
    dark: {
        text: '#ECEDEE',
        background: '#151718',
        backgroundColored: '#000',
        textOnColored: '#fff',
        primaryButtoneInverted: '#000',
        textPrimaryInverted: '#000',
        secondaryButtoneInverted: '#383d41',
        textSecondaryInverted: '#fff',
        primary: '#fff',
        primaryLight: '#e3e3e3',
        border: '#333',
        card: '#000',
        notification: '#fff',
        tint: tintColorDark,
        icon: '#fff',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
        error: '#FF453A',
    },
};

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme() ?? 'light';
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}
