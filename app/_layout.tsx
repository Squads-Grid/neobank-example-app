import '@/polyfills';
import React, { useEffect } from 'react';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@react-navigation/native';
import { lightTheme, darkTheme } from '@/constants/Theme';
import { ScreenThemeProvider } from '@/contexts/ScreenThemeContext';
import { StageProvider } from '@/contexts/StageContext';
import { useColorScheme } from '@/hooks/useColorScheme';

function AuthLayout() {
    const segments = useSegments();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const colorScheme = useColorScheme();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to the sign-in page
            router.replace('/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect away from the sign-in page
            router.replace('/');
        }
    }, [isAuthenticated, segments]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
            <ScreenThemeProvider>
                <StageProvider>
                    <RootLayoutNav />
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                    <Toast config={toastConfig} />
                </StageProvider>
            </ScreenThemeProvider>
        </ThemeProvider>
    );
}

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
        </>
    );
}

const toastConfig = {
    error: (props: { text1?: string }) => (
        <View style={{
            backgroundColor: '#000000',
            opacity: 0.4,
            padding: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            marginTop: 40,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }}>
            <Text style={{
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: '600',
            }}>
                {props.text1 || 'An error occurred'}
            </Text>
        </View>
    )
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthLayout />
        </AuthProvider>
    );
}
