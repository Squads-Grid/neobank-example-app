import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { ScreenHeaderText } from '@/components/ui/molecules';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { WithScreenTheme } from '@/components/WithScreenTheme';
import { ThemedScreen, StarburstBackground } from '@/components/ui/layout';
import { ThemedActionText, ThemedText } from '@/components/ui/atoms';
import { useResendTimer } from '@/hooks/useResendTimer';
import { Spacing } from '@/constants/Spacing';
import { router } from 'expo-router';
import { ErrorCode } from '@/utils/errors';
import { handleError } from '@/utils/errors';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';

function CreateAccountScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const [otpId, setOtpId] = useState<string | null>(null);
    const { register, verifyCodeAndCreateAccount, email, setEmail, isAuthenticated } = useAuth();
    const { textColor } = useScreenTheme();

    const triggerSignUp = async (emailToUse: string) => {

        setShowCodeInput(true);
        console.log("🚀 ~ triggerSignUp ~ emailToUse:", emailToUse)
        const result = await register(emailToUse);
        console.log("🚀 ~ triggerSignUp ~ result:", result)
        // setOtpId(result);
    };

    const handleResend = async () => {
        if (!email) {
            router.push('/(auth)/login');
            return;
        }
        await triggerSignUp(email);
    };

    const { countdown, isDisabled, handleResend: resend } = useResendTimer({
        initialSeconds: 30,
        onResend: handleResend
    });

    const verify = async (code: string): Promise<boolean> => {
        // if (!otpId) {
        //     throw new Error('No otpId found');
        // }

        console.log("🚀 ~ verify ~ code:", code)
        const success = await verifyCodeAndCreateAccount(
            code,
            // otpId
        );
        console.log("🤔 isAuthenticated:", isAuthenticated);
        if (success) {
            router.replace('/success');
        }
        return success;
    };

    const handleSubmit = async (submittedEmail: string, code?: string, formError?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setEmail(submittedEmail);

            console.log("🚀 ~ handleSubmit ~ formError:", formError)
            if (formError) {
                setError(formError);
                handleError(ErrorCode.INVALID_EMAIL, true, true);
                return;
            }

            if (code) {
                const isValid = await verify(code);
                if (!isValid) {
                    setError('Invalid code');
                    return;
                }
                // Navigate to success after successful account creation
                router.replace('/success');
            } else {
                await triggerSignUp(submittedEmail);
            }
        } catch (error) {
            console.log("🚀 ~ handleSubmit ~ error:", error)
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
                                title="Sign up"
                                // subtitle="Your finances, upgraded"
                            />
                        </View>
                        {/* <View style={[styles.headerContainer, { alignItems: 'flex-start', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg}]}>
                            <ThemedText type="large" style={{ color: textColor + 40 }}>Create your account</ThemedText>
                        </View> */}
                        <LoginForm
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            error={error}
                        />
                        <View style={[styles.headerContainer, { alignItems: 'flex-start', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, flexDirection: 'row', gap: Spacing.sm}]}>
                            <ThemedText type="default" style={{ color: textColor + 40, paddingVertical: Spacing.xs, marginTop: Spacing.xxs}}>Already have an account?</ThemedText>
                            <Pressable onPress={() => router.push('/(auth)/login')}>
                                <ThemedText type="link" style={{ color: textColor }}>Log in</ThemedText>
                            </Pressable>
                        </View>
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

export default WithScreenTheme(CreateAccountScreen, {
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
