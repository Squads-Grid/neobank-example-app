import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { ThemedScreen } from '@/components/ui/layout';
import { ThemedText, IconSymbol, LoadingSpinner } from '@/components/ui/atoms';
// TODO: check if this is needed
import { IconSymbolName } from '@/components/ui/atoms/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { formatAmount } from '@/utils/helper';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ButtonGroup } from '@/components/ui/molecules';
import { Height, Size, Weight } from '@/constants/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { decryptCredentialBundle } from '@turnkey/crypto';
import { EasClient } from '@/utils/easClient';
import { ConfirmPayload, SmartAccount } from '@/types/Transaction';
import { v4 as uuidv4 } from 'uuid';
import { GridStamper } from '@/grid/authorization';
import { clearExternalAccounts, storeExternalAccount } from '@/utils/externalAccount';
import Toast from 'react-native-toast-message';
import { ErrorCode } from '@/types/Error';
import * as Sentry from '@sentry/react-native';

// USDC has 6 decimals
const USDC_DECIMALS = 6;

interface Address {
    street_line_1: string;
    street_line_2?: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
}

export default function FiatConfirmScreen() {
    const textColor = useThemeColor({}, 'text');
    const [isLoading, setIsLoading] = useState(false);
    const { accountInfo, credentialsBundle, keypair, email, logout } = useAuth();

    const {
        amount,
        accountNumber,
        routingNumber,
        firstName,
        lastName,
        type,
        title,
        address,
        accountLabel,
        bankName,
        externalAccountId,
    } = useLocalSearchParams<{
        amount: string;
        accountNumber: string;
        routingNumber: string;
        firstName: string;
        lastName: string;
        type: string;
        title: string;
        address: string;
        accountLabel: string;
        bankName: string;
        externalAccountId: string;
    }>();

    const parsedAddress: Address = address ? JSON.parse(address) : {
        street_line_1: '',
        street_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            if (!accountInfo || !credentialsBundle || !keypair) {
                logout();
                router.push({
                    pathname: '/(auth)/login',
                });

                return;
            }

            const source: SmartAccount = {
                smart_account_address: accountInfo.smart_account_address,
                currency: 'usdc',
                authorities: [accountInfo.smart_account_signer_public_key],
            }

            // Convert amount to USDC base units (multiply by 10^6)
            const amountInBaseUnits = Math.round(parseFloat(amount) * Math.pow(10, USDC_DECIMALS)).toString();
            const payload = externalAccountId ? {
                amount: amountInBaseUnits,
                grid_user_id: accountInfo.grid_user_id,
                source: {
                    smart_account_address: accountInfo.smart_account_address,
                    currency: "usdc",
                    authorities: [accountInfo.smart_account_signer_public_key]
                },
                destination: {
                    payment_rail: "ach_push",
                    currency: "usd",
                    external_account_id: externalAccountId
                }

            }
                : {
                    amount: amountInBaseUnits,
                    grid_user_id: accountInfo.grid_user_id,
                    source: {
                        smart_account_address: accountInfo.smart_account_address,
                        currency: "usdc",
                        authorities: [accountInfo.smart_account_signer_public_key]
                    },
                    destination: {
                        payment_rail: "ach_push",
                        currency: "usd",
                        details: {
                            currency: "usd",
                            account_owner_name: `${firstName} ${lastName}`,
                            account_number: accountNumber, //900808588430
                            routing_number: routingNumber, //021000021
                            bank_name: bankName,
                            account_type: "us",
                            address: {
                                street_line_1: parsedAddress.street_line_1,
                                // street_line_2: parsedAddress.street_line_2,
                                city: parsedAddress.city,
                                state: parsedAddress.state,
                                postal_code: parsedAddress.postal_code,
                                country: parsedAddress.country
                            },
                            idempotency_key: uuidv4()
                        }
                    }
                };


            const easClient = new EasClient();
            try {
                const res = await easClient.preparePaymentIntent(payload, accountInfo.smart_account_address, true);

                // Store the external account ID with label
                if (res.data.destination.external_account_id && accountInfo.grid_user_id) {

                    await storeExternalAccount(accountInfo.grid_user_id, res.data.destination.external_account_id, accountLabel);

                }

                if (!email) {
                    logout();
                    router.push({
                        pathname: '/(auth)/login',
                    });
                    return;
                }

                const receivedPayload = res.data;
                const mpcPayload = receivedPayload.mpc_payload;
                if (!email) {
                    logout();
                    router.push({
                        pathname: '/(auth)/login',
                    });
                    return;
                }

                const decryptedData = decryptCredentialBundle(credentialsBundle, keypair.privateKey);
                const stamper = new GridStamper(decryptedData);
                const stamp = await stamper.stamp(JSON.parse(mpcPayload));

                const confirmPayload: ConfirmPayload = {
                    intentPayload: receivedPayload.intent_payload,
                    mpcPayload: JSON.stringify({
                        requestParameters: JSON.parse(mpcPayload),
                        stamp,
                    }),
                };

                await easClient.confirmPaymentIntent(
                    accountInfo.smart_account_address,
                    res.data.id,
                    confirmPayload,
                    true
                );

                router.push({
                    pathname: '/success',
                    params: { amount, type, title },
                });
            } catch (error: any) {
                console.error("API Error:", error);
                if (error?.data?.code === ErrorCode.SESSION_EXPIRED ||
                    error?.data?.details?.some((detail: any) => detail.code === 'API_KEY_EXPIRED')) {
                    Toast.show({
                        text1: 'Session expired, please log in again',
                        type: 'error',
                        visibilityTime: 5000,
                    });
                    logout();
                    return;
                }
                Sentry.captureException(new Error(`Failed to confirm payment: ${error}. (send)/fiatconfirm.tsx (handleConfirm)`));
                throw error;
            }
        } catch (err) {
            console.error("Failed to sign transaction:", err);
            Sentry.captureException(new Error(`Failed to sign transaction: ${err}. (send)/fiatconfirm.tsx (handleConfirm)`));
            Toast.show({
                text1: 'An error occurred while processing your transaction. Please try again.',
                type: 'error',
                visibilityTime: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push({
            pathname: '/(tabs)',
            params: { amount, type, title }
        });
    };

    const renderInfo = (icon: IconSymbolName, label: string, value: string) => {
        const iconColor = textColor + '40';

        return (
            <View>
                <View style={styles.labelContainer}>
                    <IconSymbol name={icon} size={16} color={iconColor} />
                    <ThemedText type="regular" style={{ color: iconColor }}>{label}</ThemedText>
                </View>
                <ThemedText type="default" style={styles.infoText}>{value}</ThemedText>
            </View>
        )
    }

    const renderAddress = () => {
        return (
            <View style={styles.addressContainer}>
                <ThemedText type="regular" style={{ color: textColor + '40', marginBottom: Spacing.sm }}>Address</ThemedText>
                <View style={styles.addressContent}>
                    <ThemedText type="default" style={styles.infoText}>{parsedAddress.street_line_1}</ThemedText>
                    {parsedAddress.street_line_2 && (
                        <ThemedText type="default" style={styles.infoText}>{parsedAddress.street_line_2}</ThemedText>
                    )}
                    <ThemedText type="default" style={styles.infoText}>
                        {`${parsedAddress.city}, ${parsedAddress.state} ${parsedAddress.postal_code || ''}`}
                    </ThemedText>
                    <ThemedText type="default" style={styles.infoText}>{parsedAddress.country}</ThemedText>
                </View>
            </View>
        );
    };

    return (
        <ThemedScreen useSafeArea={true} safeAreaEdges={['bottom', 'left', 'right']}>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ gap: Spacing.sm }}>
                            <ThemedText type="regular">Amount</ThemedText>
                            <ThemedText type="jumbo" >{formatAmount(amount)}</ThemedText>
                        </View>
                        {externalAccountId ? (
                            renderInfo('creditcard', 'Account', accountLabel)
                        ) : (
                            <>
                                {renderInfo('person', 'Recipient', `${firstName} ${lastName}`)}
                                {renderInfo('creditcard', 'Account', `****${accountNumber.slice(-4)}`)}
                                {renderInfo('building.columns', 'Bank', bankName)}
                                {renderInfo('building.columns', 'Routing', routingNumber)}
                                {renderAddress()}
                            </>
                        )}
                    </View>

                    <ButtonGroup
                        leftTitle='Cancel'
                        leftVariant='secondary'
                        rightTitle='Confirm'
                        rightVariant='primary'
                        leftOnPress={handleCancel}
                        rightOnPress={handleConfirm}
                    />
                </View>
            )}
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.xl,
    },
    content: {
        flex: 1,
        gap: Spacing.lg,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.sm
    },
    infoText: {
        fontSize: Size.mediumLarge,
        fontWeight: Weight.semiBoldWeight,
        lineHeight: Size.mediumLarge * Height.lineHeightMedium,
    },
    addressContainer: {
        marginTop: Spacing.sm,
    },
    addressContent: {
        gap: Spacing.xs,
    },

}); 