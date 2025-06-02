import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedScreen } from '@/components/ui/layout';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Keypad, ThemedButton, ThemedTextInput } from '@/components/ui/molecules';
import { router, useLocalSearchParams } from 'expo-router';
import { Chip, IconSymbol, ThemedText } from '@/components/ui/atoms';
import { formatAmount } from '@/utils/helper';
import { CountryCode, ExternalAccountMapping, UsAccountType } from '@/types/Transaction';
import { deleteAccount, getExternalAccountIds } from '@/utils/externalAccount';
import { Address, AddressInput, ACHBankAccount, PersonalInformation, AccountLabel } from '@/types/ExternalAccounts';
import { handleError, ErrorCode } from '@/utils/errors';
import { useWalletData } from '@/hooks/useWalletData';
import { useAuth } from '@/contexts/AuthContext';


export default function AmountScreen() {
    const [amount, setAmount] = useState('0');
    const [step, setStep] = useState(1);
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accountType, setAccountType] = useState<UsAccountType>('checking');
    const [country, setCountry] = useState<CountryCode>('USA');
    const [accountLabel, setAccountLabel] = useState('');
    const [bankName, setBankName] = useState('');
    const [externalAccounts, setExternalAccounts] = useState<ExternalAccountMapping[]>([]);
    const { accountInfo } = useAuth();
    const { balance } = useWalletData(accountInfo);

    const [address, setAddress] = useState<AddressInput>({
        street_number: '',
        street_name: '',
        street_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
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
            label: 'Select account',
            render: () => renderAccountList(),
        },
        {
            index: 3,
            label: 'Enter your details',
            render: () => renderBankDetails(),
        }
    ]

    async function getExtAccount() {
        const ext = await getExternalAccountIds();
        ext?.accounts.forEach(account => {
            if (account.label === "[object Object]") {
                // Remove account with invalid label
                deleteAccount(account.grid_user_id, account.external_account_id);
            }

        })
        setExternalAccounts(ext?.accounts ?? []);
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

    const handleExistingContinue = (label?: string, id?: string) => {

        try {
            // If both validations pass, navigate to the next screen
            router.push({
                pathname: '/fiatconfirm',
                params: {
                    amount,
                    accountLabel: label,
                    externalAccountId: id
                }
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            handleError(ErrorCode.UNKNOWN_ERROR, true, true);
        }
    }

    const handleContinue = () => {
        if (step === 1) {
            if (Number(amount) > balance) {
                handleError(ErrorCode.INSUFFICIENT_BALANCE, true, true);
                return;
            }
            if (Number(amount) < 1) {
                handleError(ErrorCode.INVALID_AMOUNT, true, true);
                return;
            }
            setStep(2);
        } else {
            let validationError = false;

            try {
                PersonalInformation.parse({
                    first_name: firstName,
                    last_name: lastName
                });
            } catch (error) {
                validationError = true;
                handleError(ErrorCode.INVALID_NAME, true, true);
            }

            // Validate the address
            try {
                Address.parse(address);
            } catch (error) {
                validationError = true;
                handleError(ErrorCode.INVALID_ADDRESS, true, true);
            }

            // Validate the bank account
            try {
                ACHBankAccount.parse({
                    account_number: accountNumber,
                    routing_number: routingNumber,
                    bank_name: bankName
                });
            } catch (error) {
                validationError = true;
                handleError(ErrorCode.INVALID_BANK_ACCOUNT, true, true);
            }

            try {
                AccountLabel.parse({
                    label: accountLabel
                });
            } catch (error) {
                validationError = true;
                handleError(ErrorCode.INVALID_LABEL, true, true);
            }


            if (!validationError) {
                // Format address with combined street number and name
                const formattedAddress = {
                    ...address,
                    street_line_1: `${address.street_number} ${address.street_name}`.trim(),
                    street_line_2: address.street_line_2
                };
                try {
                    // If both validations pass, navigate to the next screen
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
                            address: JSON.stringify(formattedAddress),
                            bankName,
                            accountLabel: accountLabel,
                            // externalAccountId: id
                        }
                    });
                } catch (error) {
                    console.error('Unexpected error:', error);
                    handleError(ErrorCode.UNKNOWN_ERROR, true, true);
                }
            }
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

    const renderExternalAccounts = (currentLabel: string, id: string) => {
        return (
            <View key={id} style={{ marginBottom: Spacing.sm }}>
                <ThemedButton
                    title={currentLabel}
                    variant="outline"
                    textStyle={{ color: textColor }}
                    onPress={() => {
                        handleExistingContinue(currentLabel, id);
                    }} />
            </View>
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
                    <View style={styles.row}>
                        <View style={styles.quarterWidth}>
                            <ThemedTextInput
                                style={styles.input}
                                value={address.street_number}
                                onChangeText={(text) => setAddress(prev => ({ ...prev, street_number: text }))}
                                placeholder="123"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.spacer} />
                        <View style={styles.threeQuarterWidth}>
                            <ThemedTextInput
                                style={styles.input}
                                value={address.street_name}
                                onChangeText={(text) => setAddress(prev => ({ ...prev, street_name: text }))}
                                placeholder="Main St"
                            />
                        </View>
                    </View>
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
                                editable={true}
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
                        value={accountLabel}
                        onChangeText={setAccountLabel}
                    />
                    <View style={{ marginBottom: Spacing.xxxl }} />
                </View>
            </ScrollView>
        );
    };

    const renderAccountList = () => {
        return (
            <ScrollView>
                {externalAccounts?.map((account) => renderExternalAccounts(account.label, account.external_account_id))}
                <ThemedButton
                    variant="outline"
                    textStyle={{ color: textColor }}
                    title="Add new account"
                    onPress={() => {
                        setStep(3);
                    }} />
            </ScrollView>
        )
    }

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
                        {step === 3 &&
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
                    {step === 1 &&
                        <>
                            <View style={styles.amountContainer}>
                                {renderAmount()}
                            </View>
                            {renderKeypad()}
                        </>
                    }
                    {step === 2 && renderAccountList()}
                    {step === 3 && renderBankDetails()}
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
    // externalAccountContainer: {
    //     padding: Spacing.md,
    //     borderWidth: 1,
    //     borderRadius: 10,
    // },
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
    quarterWidth: {
        flex: 1,
    },
    threeQuarterWidth: {
        flex: 3,
    },
}); 