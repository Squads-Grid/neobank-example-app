import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';
import { ThemedView, LoadingSpinner, ThemedText } from '@/components/ui/atoms';
import { ThemedTextInput } from '@/components/ui/molecules';
import { ScreenVerificationCodeInput } from '@/components/ui/organisms';
import { Spacing } from '@/constants/Spacing';
import { Email } from '@/types/Auth';
import { handleError, ErrorCode } from '@/utils/errors';

interface LoginFormProps {
    onSubmit: (email: string, code?: string, error?: string) => void;
    isLoading?: boolean;
    style?: ViewStyle;
    error?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, style, error }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);

    const handleEmailSubmit = () => {
        try {
            Email.parse(email);
            setShowCodeInput(true);
            onSubmit(email);
        } catch (error) {
            onSubmit(email, undefined, 'Invalid email. Please try again.');
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
                            <ThemedTextInput
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
                            <ThemedText style={styles.text}>
                                Enter the code from your e-mail
                            </ThemedText>
                            <ScreenVerificationCodeInput onCodeComplete={handleCodeComplete} />
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
    }
});