import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Spacing } from '@/constants/Spacing';

interface ThemedScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
    useSafeArea?: boolean;
    safeAreaEdges?: Edge[];
}

export function ThemedScreen({
    children,
    style,
    useSafeArea = true,
    safeAreaEdges = ['top', 'right', 'bottom', 'left']
}: ThemedScreenProps) {
    const { backgroundColor } = useScreenTheme();

    const isDarkBackground = backgroundColor.toLowerCase() === '#000' || backgroundColor.toLowerCase() === '#000000';
    const statusBarStyle = isDarkBackground ? 'light' : 'dark';

    const content = (
        <>
            <StatusBar style={statusBarStyle} />
            <View style={[styles.container, style]}>
                {children}
            </View>
        </>
    );

    if (useSafeArea) {
        return (
            <SafeAreaView

                style={{ flex: 1, backgroundColor }}
                edges={safeAreaEdges}
            >
                {content}
            </SafeAreaView>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor }}>
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
    },
});