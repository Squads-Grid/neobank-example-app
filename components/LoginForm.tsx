import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ScreenVerificationCodeInput } from '@/components/ui/ScreenVerificationCodeInput';
import { Spacing } from '@/constants/Spacing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ThemedScreenTextInput } from '@/components/ui/ThemedScreenTextInput';
import { ThemedScreenText } from './ui/ThemedScreenText';

interface LoginFormProps {
    onSubmit: (email: string, code?: string) => void;
    isLoading?: boolean;
    style?: ViewStyle;
    error?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, style, error }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);

    const handleEmailSubmit = () => {
        if (email.trim()) {
            setShowCodeInput(true);
            onSubmit(email);
        }
    };

    const handleCodeComplete = (completeCode: string) => {
        onSubmit(email, completeCode);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, style]}
        >
            {isLoading ? <LoadingSpinner /> : (
                <ThemedView lightColor="transparent" darkColor="transparent" style={styles.themedViewInner}>
                    {!showCodeInput ? (
                        <>
                            <ThemedScreenTextInput
                                placeholder="Enter your e-mail"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                onButtonPress={handleEmailSubmit}
                                buttonIcon="arrow-forward"
                                style={{ marginBottom: Spacing.md }}
                            />

                        </>
                    ) : (
                        <>
                            <ThemedScreenText style={styles.text}>
                                Enter the code from your e-mail
                            </ThemedScreenText>
                            <ScreenVerificationCodeInput onCodeComplete={handleCodeComplete} />
                            {error && (
                                <ThemedScreenText
                                    style={styles.errorText}
                                >
                                    {error}
                                </ThemedScreenText>
                            )}
                        </>
                    )}
                </ThemedView>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    themedViewInner: {
        paddingHorizontal: Spacing.md,
    },
    text: {
        textAlign: 'center',
        marginBottom: Spacing.lg,
        maxWidth: 300,
        alignSelf: 'center',
    },
    errorText: {
        textAlign: 'center',
        marginTop: Spacing.md,
        fontWeight: 'bold',
    }
});