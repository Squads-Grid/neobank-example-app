import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedScreen } from '@/components/ui/layout';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Keypad, ThemedScreenButton, ThemedScreenTextInput } from '@/components/ui/molecules';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedScreenText } from '@/components/ui/atoms';
import * as Clipboard from 'expo-clipboard';
import { formatAmount } from '@/utils/helper';




export default function AmountScreen() {
    const [amount, setAmount] = useState('0');
    const [step, setStep] = useState(1);
    const [recipient, setRecipient] = useState('');
    const [name, setName] = useState('');
    const textColor = useThemeColor({}, 'text');

    const steps = [
        {
            index: 1,
            label: 'Enter amount',
            render: () => renderAmount(),
        },
        {
            index: 2,
            label: 'Enter destination',
            render: () => renderTextInputs(),
        }
    ]

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
                    name,
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

    const handleCopyRecipient = async () => {
        try {
            const clipboardContent = await Clipboard.getStringAsync();
            if (clipboardContent) {
                setRecipient(clipboardContent);
            }
        } catch (error) {
            console.error('Failed to get clipboard content:', error);
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
            <ThemedScreenText type="highlight" style={{ color: textColor }}>
                {formatAmount(amount)}
            </ThemedScreenText>
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
                    value={name}
                    onChangeText={setName}
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
                    <ThemedScreenText type="defaultSemiBold" style={styles.label}>{steps[step - 1].label}</ThemedScreenText>

                    {steps[step - 1].render()}
                </View>

                {step === 1 && renderKeypad()}
                <View style={styles.buttonContainer}>
                    <ThemedScreenButton
                        title="Continue"
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
        marginBottom: Spacing.sm,
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
        marginBottom: Spacing.xxl,
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