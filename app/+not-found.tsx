import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { ThemedView } from '@/components/ui/ThemedView';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <ThemedView style={styles.container}>
                <ThemedScreenText type="title">This screen doesn't exist.</ThemedScreenText>
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
