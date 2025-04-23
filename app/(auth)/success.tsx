import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { StarburstFull } from '@/components/ui/StarburstFull';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Spacing } from '@/constants/Spacing';
import { withScreenTheme } from '@/components/withScreenTheme';

export function SuccessScreen() {
    const { primaryColor } = useScreenTheme();

    const handleContinue = () => {
        // Navigate to the main app
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
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
                <ThemedScreenText style={styles.subtitle}>All done!</ThemedScreenText>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default withScreenTheme(SuccessScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        paddingHorizontal: 24,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        marginBottom: 32,
        textAlign: 'center',
    },
}); 