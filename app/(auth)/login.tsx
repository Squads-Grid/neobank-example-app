import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { ScreenHeaderText } from '@/components/ui/molecules';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBackground } from '@/components/ui/layout';
import { ThemedActionText } from '@/components/ui/atoms';
import { useResendTimer } from '@/hooks/useResendTimer';
import { Spacing } from '@/constants/Spacing';
import { router } from 'expo-router';

function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otpId, setOtpId] = useState<string | null>(null);
    const { authenticate, verifyCode, email, setEmail } = useAuth();

    const triggerAuthentication = async (emailToUse: string) => {

        setShowCodeInput(true);
        const result = await authenticate(emailToUse);
        setOtpId(result);
    };

    const handleResend = async () => {
        if (!email) {
            router.push('/(auth)/login');
            return;
        }
        await triggerAuthentication(email);
    };

    const { countdown, isDisabled, handleResend: resend } = useResendTimer({
        initialSeconds: 30,
        onResend: handleResend
    });

    const verify = async (code: string): Promise<boolean> => {
        if (!otpId) {
            throw new Error('No otpId found');
        }

        // Simulate API delay
        const result = await verifyCode(
            code,
            otpId
        );
        return result;
    };

    const handleSubmit = async (submittedEmail: string, code?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setEmail(submittedEmail);
            if (code && otpId) {
                const isValid = await verify(code);
                if (!isValid) {
                    setError('Invalid code');
                    return;
                }

            } else {
                await triggerAuthentication(submittedEmail);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedScreen>
            <StarburstBackground primaryColor={error ? '#FF0048' : "#0080FF"} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                style={styles.contentContainer}
            >
                <View style={[styles.contentContainer, { justifyContent: 'space-between' }]}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerContainer}>
                            <ScreenHeaderText
                                title="Bright"
                                subtitle="Your finances, upgraded"
                            />
                        </View>
                        <LoginForm
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            error={error}
                        />
                    </View>

                    {showCodeInput && !isLoading && (
                        <View style={styles.actionContainer}>
                            <ThemedActionText
                                onPress={resend}
                                disabled={isDisabled}
                                countdown={countdown}
                                activeText="Resend code"
                                disabledText="Resend code in"
                            />
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </ThemedScreen>
    );
}

export default withScreenTheme(LoginScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        zIndex: 1,
    },
    headerContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: Spacing.lg * 3,
    },
    actionContainer: {
        flex: 0.1,
        alignItems: 'center',
    },
});
