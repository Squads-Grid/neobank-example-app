import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedScreenText, ThemedView } from '@/components/ui/atoms';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <ThemedView style={styles.container}>
                <ThemedScreenText type="large">This screen doesn't exist.</ThemedScreenText>
                <Link href="/" style={styles.link}>
                    <ThemedScreenText type="link">Go to home screen!</ThemedScreenText>
                </Link>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
