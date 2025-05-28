import React, { useEffect } from 'react';
import { ScreenThemeProvider, useScreenTheme } from '@/contexts/ScreenThemeContext';

interface ThemeOptions {
    backgroundColor?: string;
    textColor?: string;
    primaryColor?: string;
}

export function WithScreenTheme<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    themeOptions?: ThemeOptions
) {
    // Component with screen theme controls
    function ComponentWithTheme(props: P) {
        const { setScreenTheme, resetScreenTheme } = useScreenTheme();

        useEffect(() => {
            if (themeOptions) {
                setScreenTheme(themeOptions);
            }

            return () => resetScreenTheme();
        }, []);

        return <WrappedComponent {...props} />;
    }

    // Wrap with provider
    return function WithScreenThemeProvider(props: P) {
        return (
            <ScreenThemeProvider>
                <ComponentWithTheme {...props} />
            </ScreenThemeProvider>
        );
    };
}
