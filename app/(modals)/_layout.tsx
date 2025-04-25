import { Stack } from 'expo-router';

export default function ModalsLayout() {
    return (
        // Let the parent handle modal presentation
        <Stack screenOptions={{ headerShown: false }} />
    );
} 