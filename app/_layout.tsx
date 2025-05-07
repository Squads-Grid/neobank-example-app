import '@/polyfills';
import React from 'react';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@react-navigation/native';
import { lightTheme, darkTheme } from '@/constants/Theme';
import { ScreenThemeProvider } from '@/contexts/ScreenThemeContext';
import { StageProvider } from '@/contexts/StageContext';
import { useColorScheme } from '@/hooks/useColorScheme';


function RootLayoutNav() {
    return (
        <>
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
            <Toast />
        </>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
                <ScreenThemeProvider>
                    <StageProvider>
                        <RootLayoutNav />
                        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                    </StageProvider>
                </ScreenThemeProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
