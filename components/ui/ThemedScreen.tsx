import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ThemedScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function ThemedScreen({ children, style }: ThemedScreenProps) {
    const { backgroundColor } = useScreenTheme();

    const isDarkBackground = backgroundColor.toLowerCase() === '#000' || backgroundColor.toLowerCase() === '#000000';
    const statusBarStyle = isDarkBackground ? 'light' : 'dark';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <StatusBar style={statusBarStyle} />
            <View style={[styles.container, { backgroundColor }, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});