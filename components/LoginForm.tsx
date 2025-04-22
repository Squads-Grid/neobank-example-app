import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { VerificationCodeInput } from '@/components/ui/VerificationCodeInput';
import { Spacing } from '@/constants/Spacing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InputWithButton } from './ui/InputWithButton';

interface LoginFormProps {
    onSubmit: (email: string, code?: string) => void;
    isLoading?: boolean;
    style?: ViewStyle;
}

export function LoginForm({ onSubmit, isLoading = false, style }: LoginFormProps) {
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
                            <InputWithButton
                                placeholder="Enter your e-mail"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                onButtonPress={handleEmailSubmit}
                                style={{ marginBottom: Spacing.md }}
                            />
                        </>
                    ) : (
                        <>
                            <ThemedText lightColor="#ffffff" darkColor="#ffffff" style={{ textAlign: 'center', marginBottom: Spacing.lg, maxWidth: 300, alignSelf: 'center' }}>
                                Enter the code from your e-mail
                            </ThemedText>
                            <VerificationCodeInput onCodeComplete={handleCodeComplete} />

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
    }
});