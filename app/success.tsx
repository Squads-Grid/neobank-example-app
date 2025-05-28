import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText, IconSymbol } from '@/components/ui/atoms';
import { StarburstFull, ThemedScreen } from '@/components/ui/layout';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Spacing } from '@/constants/Spacing';
import { WithScreenTheme } from '@/components/WithScreenTheme';

export function SuccessScreen() {
    const { primaryColor } = useScreenTheme();

    const handleContinue = () => {
        // Navigate to the main app
        router.replace('/(tabs)');
    };

    return (
        <ThemedScreen style={styles.container}>
            <StarburstFull
                primaryColor="#00FF80"
                opacity={0.7}
                style={styles.background}
            />
            <TouchableOpacity
                style={styles.content}
                onPress={handleContinue}
                activeOpacity={0.8}
            >
                <IconSymbol name="checkmark.circle" size={80} color={primaryColor} style={{ marginBottom: Spacing.md }} />
                <ThemedText type="default" style={styles.subtitle}>All done!</ThemedText>
            </TouchableOpacity>
        </ThemedScreen>
    );
}

export default WithScreenTheme(SuccessScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    subtitle: {
        opacity: 0.7,
    },
}); 