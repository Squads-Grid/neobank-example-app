import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedScreen } from '@/components/ui/layout';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Keypad, ThemedButton, ThemedTextInput } from '@/components/ui/molecules';
import { router, useLocalSearchParams } from 'expo-router';
import { Chip, IconSymbol, ThemedText } from '@/components/ui/atoms';
import * as Clipboard from 'expo-clipboard';
import { formatAmount } from '@/utils/helper';
import { CountryCode, UsAccountType } from '@/types/Transaction';

export default function AmountScreen() {
    const [amount, setAmount] = useState('0');
    const [step, setStep] = useState(1);
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountType, setAccountType] = useState<UsAccountType>('checking');
    const [country, setCountry] = useState<CountryCode>('USA');
    const textColor = useThemeColor({}, 'text');

    const steps = [
        {
            index: 1,
            label: 'Enter amount',
            render: () => renderAmount(),
        },
        {
            index: 2,
            label: 'Recipient details',
            render: () => renderBankDetails(),
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
                pathname: '/fiatconfirm',
                params: {
                    amount,
                    accountNumber,
                    routingNumber,
                    firstName,
                    lastName,
                    accountType,
                    country,
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



    const renderKeypad = () => {
        return (

            <View style={styles.keypadContainer}>
                <Keypad onKeyPress={handleKeyPress} />
            </View>

        );
    };

    const renderAmount = () => {
        return (
            <ThemedText type="highlight" style={{ color: textColor }}>
                {formatAmount(amount)}
            </ThemedText>
        )
    }

    const renderBankDetails = () => {
        return (
            <View style={styles.bankDetailsContainer}>
                <ThemedTextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                />
                <View style={{ marginBottom: Spacing.sm }} />
                <ThemedTextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                />
                <View style={{ marginBottom: Spacing.sm }} />
                <ThemedTextInput
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    placeholder="Account Number"
                    keyboardType="numeric"
                />
                <View style={{ marginBottom: Spacing.sm }} />
                <ThemedTextInput
                    value={routingNumber}
                    onChangeText={setRoutingNumber}
                    placeholder="Routing Number"
                    keyboardType="numeric"
                />
                <View style={{ marginBottom: Spacing.sm }} />
                {/* <ThemedTextInput
                    value={accountType}
                    onChangeText={(text) => setAccountType(text as UsAccountType)}
                    placeholder="Account Type (Checking/Savings)"
                />
                <View style={{ marginBottom: Spacing.sm }} />
                <ThemedTextInput
                    value={country}
                    onChangeText={(text) => setCountry(text as CountryCode)}
                    placeholder="Country Code (e.g., USA)"
                /> */}
            </View>
        );
    };

    return (
        <ThemedScreen useSafeArea={true} safeAreaEdges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                style={styles.container}>
                <View style={styles.amountContainer}>
                    <View style={{ width: '100%', height: 30, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <ThemedText type="defaultSemiBold" style={[styles.label, { paddingVertical: 4 }]}>{steps[step - 1].label}</ThemedText>
                        {step === 2 &&
                            <Chip style={{ paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <ThemedText type="tiny">
                                        ACH{' '}
                                    </ThemedText>
                                    <IconSymbol name="chevron.down" size={12} color={textColor} />
                                </View>
                            </Chip>
                        }
                    </View>
                    {steps[step - 1].render()}
                </View>

                {step === 1 && renderKeypad()}
                <View style={styles.buttonContainer}>
                    <ThemedButton
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
    buttonContainer: {
        width: '100%',
        marginTop: Spacing.lg,
        marginBottom: Spacing.xxl,
    },
    bankDetailsContainer: {
        width: '100%',
        paddingHorizontal: Spacing.lg,
    },
}); 