import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import { StarburstFull } from '@/components/ui/StarburstFull';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Spacing } from '@/constants/Spacing';
export default function SuccessScreen() {
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
    iconContainer: {
        marginBottom: 24,
    },
    checkmarkBorder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        width: '100%',
        maxWidth: 280,
    },
}); 