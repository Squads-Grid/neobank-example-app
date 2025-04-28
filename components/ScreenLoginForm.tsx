import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedScreenTextInput, ThemedScreenButton } from '@/components/ui/molecules';
import { Spacing } from '@/constants/Spacing';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';

interface ScreenLoginFormProps {
    onSubmit: (email: string) => void;
    isLoading?: boolean;
}

export function ScreenLoginForm({ onSubmit, isLoading = false }: ScreenLoginFormProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const { textColor } = useScreenTheme();

    const handleSubmit = () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }
        setError(undefined);
        onSubmit(email);
    };

    return (
        <View style={styles.container}>
            <ThemedScreenTextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!error}
            />
            <ThemedScreenButton
                onPress={handleSubmit}
                disabled={isLoading}
                style={styles.button}
                title={isLoading ? "Loading..." : "Continue"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: Spacing.md,
    },
    button: {
        marginTop: Spacing.sm,
    },
}); 