import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@react-navigation/native';
import { lightTheme, darkTheme } from '@/constants/Theme';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { useColorScheme } from '@/hooks/useColorScheme';


// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
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
                <RootLayoutNav />
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </ThemeProvider>
        </AuthProvider>
    );
}
