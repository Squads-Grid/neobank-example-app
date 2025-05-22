import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedScreen } from '@/components/ui/layout';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Keypad, ThemedButton, ThemedTextInput } from '@/components/ui/molecules';
import { router, useLocalSearchParams } from 'expo-router';
import { Chip, IconSymbol, ThemedText } from '@/components/ui/atoms';
import { formatAmount } from '@/utils/helper';
import { CountryCode, UsAccountType } from '@/types/Transaction';
import { getExternalAccountIds } from '@/utils/externalAccount';

interface Address {
    street_line_1: string;
    street_line_2?: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
}

export default function AmountScreen() {
    const [amount, setAmount] = useState('0');
    const [step, setStep] = useState(1);
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountType, setAccountType] = useState<UsAccountType>('checking');
    const [country, setCountry] = useState<CountryCode>('USA');
    const [label, setLabel] = useState('');
    const [bankName, setBankName] = useState('');

    const [address, setAddress] = useState<Address>({
        street_line_1: '',
        street_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'USA'
    });
    const textColor = useThemeColor({}, 'text');

    const steps = [
        {
            index: 1,
            label: 'Enter amount',
            render: () => renderAmount(),
        },
        {
            index: 2,
            label: 'Enter your details',
            render: () => renderBankDetails(),
        }
    ]

    async function getExtAccount() {
        const ext = await getExternalAccountIds();

    }

    useEffect(() => {


        getExtAccount();
    }, []);

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
                    title,
                    address: JSON.stringify(address),
                    bankName,
                    label
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
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.bankDetailsContainer}>
                    <ThemedText type="regular" style={styles.sectionTitle}>Personal Information</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                    />
                    <View style={{ marginBottom: Spacing.sm }} />
                    <ThemedTextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                    />
                    <View style={{ marginBottom: Spacing.lg }} />

                    <ThemedText type="regular" style={styles.sectionTitle}>Address</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        value={address.street_line_1}
                        onChangeText={(text) => setAddress(prev => ({ ...prev, street_line_1: text }))}
                        placeholder="e.g. Main 123"
                    />
                    <View style={{ marginBottom: Spacing.sm }} />
                    <ThemedTextInput
                        style={styles.input}
                        value={address.street_line_2}
                        onChangeText={(text) => setAddress(prev => ({ ...prev, street_line_2: text }))}
                        placeholder="e.g. APT 2135"
                    />
                    <View style={{ marginBottom: Spacing.sm }} />
                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <ThemedTextInput
                                style={styles.input}
                                value={address.city}
                                onChangeText={(text) => setAddress(prev => ({ ...prev, city: text }))}
                                placeholder="e.g. Austin"
                            />
                        </View>
                        <View style={styles.spacer} />
                        <View style={styles.halfWidth}>
                            <ThemedTextInput
                                style={styles.input}
                                value={address.state}
                                onChangeText={(text) => setAddress(prev => ({ ...prev, state: text }))}
                                placeholder="e.g. TX"
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: Spacing.sm }} />
                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <ThemedTextInput
                                style={styles.input}
                                value={address.postal_code}
                                onChangeText={(text) => setAddress(prev => ({ ...prev, postal_code: text }))}
                                placeholder="e.g. 78745"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.spacer} />
                        <View style={styles.halfWidth}>
                            <ThemedTextInput
                                style={styles.input}
                                value={address.country}
                                onChangeText={(text) => setAddress(prev => ({ ...prev, country: text }))}
                                placeholder="USA"
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: Spacing.lg }} />

                    <ThemedText type="regular" style={styles.sectionTitle}>Bank Account</ThemedText>
                    <ThemedTextInput
                        style={styles.input}
                        value={bankName}
                        onChangeText={setBankName}
                        placeholder="Bank Name"
                    />
                    <View style={{ marginBottom: Spacing.sm }} />
                    <ThemedTextInput
                        style={styles.input}
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        placeholder="Account Number"
                        keyboardType="numeric"
                    />
                    <View style={{ marginBottom: Spacing.sm }} />
                    <ThemedTextInput
                        style={styles.input}
                        value={routingNumber}
                        onChangeText={setRoutingNumber}
                        placeholder="Routing Number"
                        keyboardType="numeric"
                    />
                    <View style={{ marginBottom: Spacing.lg }} />

                    <ThemedText type="regular" style={styles.sectionTitle}>Bank Label</ThemedText>
                    <ThemedTextInput
                        style={[styles.input]}
                        placeholder="Enter a label for this account"
                        placeholderTextColor={textColor + '40'}
                        value={label}
                        onChangeText={setLabel}
                    />
                    <View style={{ marginBottom: Spacing.xxxl }} />
                </View>
            </ScrollView>
        );
    };

    return (
        <ThemedScreen useSafeArea={true} safeAreaEdges={['bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={styles.header}>
                    <View style={styles.headerContent}>
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
                </View>

                <View style={styles.content}>
                    {step === 1 ? (
                        <>
                            <View style={styles.amountContainer}>
                                {renderAmount()}
                            </View>
                            {renderKeypad()}
                        </>
                    ) : (
                        renderBankDetails()
                    )}
                </View>

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
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    headerContent: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    amountContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    bankDetailsContainer: {
        width: '100%',
        paddingHorizontal: Spacing.lg,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    sectionTitle: {
        marginBottom: Spacing.sm,
        opacity: 0.6,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    halfWidth: {
        flex: 1,
    },
    spacer: {
        width: Spacing.sm,
    },
    input: {
        paddingVertical: Spacing.xxs,
    },
}); 