import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Keypad } from '@/components/ui/Keypad';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import { ThemedScreenTextInput } from '@/components/ui/ThemedScreenTextInput';
export default function AmountScreen() {
    const [amount, setAmount] = useState('0');
    const [step, setStep] = useState(1);
    const [recipient, setRecipient] = useState('');
    const [note, setNote] = useState('');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');

    // Get params from the router
    const { type, title } = useLocalSearchParams<{ type: string; title: string }>();

    const handleKeyPress = (key: string) => {
        if (key === 'backspace') {
            // Remove the last character
            setAmount(prev =>
                prev.length > 1 ? prev.slice(0, -1) : '0'
            );
        } else if (key === '.') {
            // Only add decimal if it doesn't exist already
            if (!amount.includes('.')) {
                setAmount(prev => prev + '.');
            }
        } else {
            // Handle number keys
            if (amount === '0') {
                setAmount(key);
            } else {
                // Limit to 2 decimal places
                const parts = amount.split('.');
                if (parts.length > 1 && parts[1].length >= 2) {
                    return;
                }
                setAmount(prev => prev + key);
            }
        }
    };

    const handleContinue = () => {
        if (step === 1) {
            setStep(2);
        } else {
            // Navigate to the next screen with all the data
            router.push({
                pathname: '/confirm',
                params: {
                    amount,
                    recipient,
                    note,
                    type,
                    title
                }
            });
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else {
            router.back();
        }
    };

    const handleCopyRecipient = () => {
        // Implement copy functionality
        console.log('Copy recipient:', recipient);
    };

    const formattedAmount = () => {
        try {
            return parseFloat(amount).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: amount.includes('.') ? 2 : 0,
                maximumFractionDigits: 2
            });
        } catch (e) {
            return '$0';
        }
    };

    const renderKeypad = () => {
        return (

            <View style={styles.keypadContainer}>
                <Keypad onKeyPress={handleKeyPress} />
            </View>

        );
    };

    const renderAmount = () => {
        return (
            <Text style={[styles.amountText, { color: textColor }]}>
                {formattedAmount()}
            </Text>
        )
    }

    const renderTextInputs = () => {
        return (
            <>
                <ThemedScreenTextInput
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder="Wallet address"
                    buttonIcon="copy"
                    onButtonPress={handleCopyRecipient}
                    withButtonBackground={false}
                />
                <View style={{ marginBottom: Spacing.sm }} />
                <ThemedScreenTextInput
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder="Give it a name"
                />
            </>
        )
    }

    return (
        <ThemedScreen useSafeArea={true} safeAreaEdges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                style={styles.container}>
                <View style={styles.amountContainer}>
                    <ThemedScreenText type="default" style={styles.label}>Enter amount</ThemedScreenText>

                    {step === 1 && renderAmount()}
                    {step === 2 && renderTextInputs()}
                </View>

                {step === 1 && renderKeypad()}
                <View style={styles.buttonContainer}>
                    <ThemedScreenButton
                        title={step === 1 ? "Continue" : "Confirm"}
                        onPress={handleContinue}
                    />
                </View>
            </KeyboardAvoidingView>
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    amountContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    label: {
        fontSize: 16,
        lineHeight: 30,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    amountText: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    keypadContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    inputsContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: Spacing.xl,
    },
    buttonContainer: {
        width: '100%',
        marginTop: Spacing.lg,
        marginBottom: Spacing.md,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    copyIcon: {
        position: 'absolute',
        right: Spacing.md,
        padding: Spacing.xs,
    },
}); 