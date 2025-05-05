import '@/polyfills';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@react-navigation/native';
import { lightTheme, darkTheme } from '@/constants/Theme';
import { LoadingSpinner } from '@/components/ui/atoms';
import { ScreenThemeProvider } from '@/contexts/ScreenThemeContext';
import { StageProvider } from '@/contexts/StageContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { useColorScheme } from '@/hooks/useColorScheme';


export const unstable_settings = {
    // Ensure that reloading on modals doesn't unmount the parent screen
    initialRouteName: '(tabs)',
};

function RootLayoutNav() {
    console.log("🚧 crypto.getRandomValues exists?", typeof crypto?.getRandomValues);
    return (
        <Stack>
            <Stack.Screen
                name="(auth)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="(send)"
                options={{ headerShown: false }}
            />
            {/* <Stack.Screen
                name="(receive)"
                options={{ headerShown: false }}
            /> */}
            <Stack.Screen
                name="(modals)"
                options={{
                    headerShown: false,
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                    animationTypeForReplace: 'push',
                }}
            />
            <Stack.Screen
                name="success"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (loaded) {
            // SplashScreen.hideAsync();
            setTimeout(() => {
                setReady(true);
            }, 1000);
        }
    }, [loaded]);

    if (!ready) {
        return <LoadingSpinner />;
    }

    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
                <ScreenThemeProvider>
                    <StageProvider>
                        <BalanceProvider>
                            <RootLayoutNav />
                            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                        </BalanceProvider>
                    </StageProvider>
                </ScreenThemeProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
