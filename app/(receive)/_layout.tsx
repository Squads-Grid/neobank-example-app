import { Stack } from 'expo-router';

export default function ReceiveLayout() {
    return (
        <Stack>
            <Stack.Screen name="bankdetails" options={{ headerShown: false }} />
        </Stack>
    );
} 