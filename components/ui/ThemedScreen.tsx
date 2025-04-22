import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ThemedScreenProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function ThemedScreen({ children, style }: ThemedScreenProps) {
    const { backgroundColor } = useScreenTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
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