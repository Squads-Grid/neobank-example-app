// import '@/polyfills';
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
import { useColorScheme } from '@/hooks/useColorScheme';
import { ModalFlowProvider } from '@/contexts/ModalFlowContext';
import * as Sentry from '@sentry/react-native';
import { sentryApiResponse } from '@/types/Sentry';
import { EasClient } from '@/utils/easClient';

// Sentry for error tracking
if (process.env.EXPO_PUBLIC_GRID_ENV === 'production') {
    const initSentry = async () => {
        try {
            const easClient = new EasClient();
            const response = await easClient.getSentryConfig();
            const sentryConfig = sentryApiResponse.parse(response);

            Sentry.init({
                ...sentryConfig,
                integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
            });
        } catch (error) {
            console.error('Failed to initialize Sentry:', error);

        }
    };

    initSentry();
}

function AuthLayout() {
    const segments = useSegments();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const colorScheme = useColorScheme();



    useEffect(() => {
        if (isAuthenticated === null) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to the sign-in page
            router.replace('/create-account');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect away from the sign-in page
            router.replace('/');
        }
    }, [isAuthenticated, segments]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
            <ScreenThemeProvider>
                <ModalFlowProvider>
                    <Slot />
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                    <Toast config={toastConfig} />
                </ModalFlowProvider>
            </ScreenThemeProvider>
        </ThemeProvider>
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

export default process.env.EXPO_PUBLIC_GRID_ENV === 'production'
    ? Sentry.wrap(function RootLayout() {
        return (
            <AuthProvider>
                <AuthLayout />
            </AuthProvider>
        );
    })
    : function RootLayout() {
        return (
            <AuthProvider>
                <AuthLayout />
            </AuthProvider>
        );
    };