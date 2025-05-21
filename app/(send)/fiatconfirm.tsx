import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedScreen } from '@/components/ui/layout';
import { ThemedText, IconSymbol, LoadingSpinner } from '@/components/ui/atoms';
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
import { SmartAccount, UsAccountType, CountryCode } from '@/types/Transaction';
import { v4 as uuidv4 } from 'uuid';
import { GridStamper } from '@/utils/stamper';

// USDC has 6 decimals
const USDC_DECIMALS = 6;

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
        accountType,
        country,
        type,
        title
    } = useLocalSearchParams<{
        amount: string;
        accountNumber: string;
        routingNumber: string;
        firstName: string;
        lastName: string;
        accountType: UsAccountType;
        country: CountryCode;
        type: string;
        title: string;
    }>();

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



            // {
            //     type: 'ach',
            //     currency: 'usd',
            //     details: {
            //         currency: 'usd',
            //         account_owner_name: `${firstName} ${lastName}`,
            //         account_number: accountNumber,
            //         routing_number: routingNumber,
            //         bank_name: 'Test Bank',
            //         account_type: 'us',//countType,
            //         account: {
            //             checking_or_savings: 'checking',
            //             last_4: accountNumber.slice(-4),
            //             routing_number: routingNumber
            //         },
            //         address: {
            //             street_line_1: "123 Main St", // TODO: Add address fields
            //             city: "New York",
            //             state: "NY",
            //             postal_code: "10001",
            //             country: country
            //         },
            //         idempotency_key: uuidv4()
            //     }
            // }

            // Convert amount to USDC base units (multiply by 10^6)
            const amountInBaseUnits = Math.round(parseFloat(amount) * Math.pow(10, USDC_DECIMALS)).toString();


            const payload = {
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
                        bank_name: "Bank of Nowhere",
                        account_owner_name: "Fred Feuerstein",
                        account_number: "900808588430",
                        routing_number: "021000021",
                        account_type: "us",
                        address: {
                            street_line_1: "1800 North Pole St.",
                            city: "Orlando",
                            state: "FL",
                            postal_code: "32801",
                            country: "USA"
                        },
                        idempotency_key: uuidv4()
                    }
                }
            };

            const easClient = new EasClient();
            const res = await easClient.preparePaymentIntent(payload, accountInfo.smart_account_address);
            console.log("🚀 ~ handleConfirm ~ res:", res)

            if (!email) {
                logout();
                router.push({
                    pathname: '/(auth)/login',
                });
                return;
            }

            const decryptedData = decryptCredentialBundle(credentialsBundle, keypair.privateKey);
            const stamper = new GridStamper(decryptedData);
            const stamp = await stamper.stamp(JSON.parse(res.data.mpc_payload));

            const confirmPayload = {
                transaction: res.data.transaction_hash,
                mpcPayload: {
                    requestParameters: JSON.parse(res.data.mpc_payload),
                    stamp,
                }
            };

            const response = await easClient.confirmPaymentIntent(
                accountInfo.smart_account_address,
                res.data.id,
                JSON.stringify(confirmPayload),
                true
            );

            router.push({
                pathname: '/success',
                params: { amount, type, title },
            });
        } catch (err) {
            console.error("Failed to sign transaction:", err);
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
                        {renderInfo('person', 'Recipient', `${firstName} ${lastName}`)}
                        {renderInfo('creditcard', 'Account', `****${accountNumber.slice(-4)}`)}
                        {renderInfo('building.columns', 'Bank', `Routing: ${routingNumber}`)}
                        {renderInfo('network', 'Network fee', '0.0004 SOL')}
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
}); 