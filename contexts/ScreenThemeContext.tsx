import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Sentry from '@sentry/react-native';

interface ScreenThemeContextType {
    backgroundColor: string;
    textColor: string;
    primaryColor: string;
    setScreenTheme: (theme: {
        backgroundColor?: string;
        textColor?: string;
        primaryColor?: string;
    }) => void;
    resetScreenTheme: () => void;
}

const ScreenThemeContext = createContext<ScreenThemeContextType | undefined>(undefined);

export function ScreenThemeProvider({ children }: { children: ReactNode }) {
    // Get default colors from the global theme
    const defaultBackground = useThemeColor({}, 'background');
    const defaultText = useThemeColor({}, 'text');
    const defaultPrimary = useThemeColor({}, 'primary');

    const [backgroundColor, setBackgroundColor] = useState(defaultBackground);
    const [textColor, setTextColor] = useState(defaultText);
    const [primaryColor, setPrimaryColor] = useState(defaultPrimary);

    const setScreenTheme = (theme: {
        backgroundColor?: string;
        textColor?: string;
        primaryColor?: string;
    }) => {
        if (theme.backgroundColor) setBackgroundColor(theme.backgroundColor);
        if (theme.textColor) setTextColor(theme.textColor);
        if (theme.primaryColor) setPrimaryColor(theme.primaryColor);
    };

    const resetScreenTheme = () => {
        setBackgroundColor(defaultBackground);
        setTextColor(defaultText);
        setPrimaryColor(defaultPrimary);
    };

    return (
        <ScreenThemeContext.Provider
            value={{
                backgroundColor,
                textColor,
                primaryColor,
                setScreenTheme,
                resetScreenTheme,
            }}
        >
            {children}
        </ScreenThemeContext.Provider>
    );
}

export function useScreenTheme() {
    const context = useContext(ScreenThemeContext);
    if (context === undefined) {
        Sentry.captureException(new Error(`useScreenTheme must be used within a ScreenThemeProvider. (contexts)/ScreenThemeContext.tsx (useScreenTheme)`));
        throw new Error('useScreenTheme must be used within a ScreenThemeProvider');
    }
    return context;
}