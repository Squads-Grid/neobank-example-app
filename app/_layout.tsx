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
import { useColorScheme } from '@/hooks/useColorScheme';
import { ModalFlowProvider } from '@/contexts/ModalFlowContext';
import * as Sentry from '@sentry/react-native';

if (process.env.EXPO_PUBLIC_GRID_ENV === 'sandbox') {
    Sentry.init({
        dsn: 'https://45bf667b41c7be362e40a5b99c33e36a@o1065299.ingest.us.sentry.io/4509412854333441',

        // Adds more context data to events (IP address, cookies, user, etc.)
        // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
        sendDefaultPii: true,

        // Configure Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1,
        integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

        // uncomment the line below to enable Spotlight (https://spotlightjs.com)
        // spotlight: __DEV__,
    });
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
            router.replace('/login');
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

export default process.env.EXPO_PUBLIC_GRID_ENV === 'sandbox'
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