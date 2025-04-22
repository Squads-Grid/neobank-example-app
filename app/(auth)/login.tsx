import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { LoginForm } from '@/components/LoginForm';
import { ScreenHeaderText } from '@/components/ui/ScreenHeaderText';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { ThemedScreenActionText } from '@/components/ui/ThemedScreenActionText';
import { useResendTimer } from '@/hooks/useResendTimer';

// Require the new image - ADJUST PATH IF NEEDED
const starburstTopImage = require('@/assets/images/starburst-top.png');

// Mock verification code
const MOCK_VERIFICATION_CODE = '123123';


function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();

    const sendVerificationCode = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Here you would typically send the verification code to the user's email
            console.log('Sending verification code to:', email);
            // Simulate verification delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Mock verification code:', MOCK_VERIFICATION_CODE);
        } catch (error) {
            console.error('Error sending code:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const { countdown, isDisabled, handleResend } = useResendTimer({
        initialSeconds: 30,
        onResend: sendVerificationCode
    });

    const verifyCode = async (code: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return code === MOCK_VERIFICATION_CODE;
    };

    const handleSubmit = async (submittedEmail: string, code?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setEmail(submittedEmail);

            if (code) {
                const isValid = await verifyCode(code);
                if (!isValid) {
                    setError('Invalid code');
                    return;
                }
                await signIn(submittedEmail, code);
            } else {
                setShowCodeInput(true);
                await sendVerificationCode();
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedScreen>
            {/* Background Image - Top */}
            <Image
                source={starburstTopImage}
                style={styles.backgroundImage}
                resizeMode="cover" // Adjust as needed
            />

            {/* Content Container */}
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.contentContainer, { justifyContent: 'space-between' }]}>
                <View style={styles.contentContainer}>
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
                    <View>
                        <ThemedScreenActionText
                            onPress={handleResend}
                            disabled={isDisabled}
                            countdown={countdown}
                            activeText="Resend code"
                            disabledText="Resend code in"
                        />
                    </View>
                )}
            </KeyboardAvoidingView>
        </ThemedScreen>
    );
}

export default withScreenTheme(LoginScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

// Add StyleSheet
const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        left: '-18%',
        top: '-10%',
        width: '150%',
        height: '150%',
    },
    contentContainer: {
        flex: 1,
        zIndex: 1,
    },
    headerContainer: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 72,
    },
    actionContainer: {
        flex: 0.4,
        alignItems: 'center',
        marginVertical: 16,
    },
});
