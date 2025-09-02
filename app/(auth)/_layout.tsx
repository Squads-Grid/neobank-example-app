import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="start" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="create-account" options={{ headerShown: false }} />
        </Stack>
    );
} 