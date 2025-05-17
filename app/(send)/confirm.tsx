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
import { signTransactionWithTurnkey } from '@/utils/turnkey';
import { useAuth } from '@/contexts/AuthContext';
import { TurnkeySuborgStamper } from '@/utils/turnkey';
import { VersionedTransaction, Connection } from '@solana/web3.js';
import { decryptCredentialBundle } from '@turnkey/crypto';
import { EasClient } from '@/utils/easClient';
import { Currency, PreparePaymentIntentParams, SmartAccount, SolanaAddress } from '@/types/Transaction';
import { v4 as uuidv4 } from 'uuid';

// USDC has 6 decimals
const USDC_DECIMALS = 6;

export default function ConfirmScreen() {
    const textColor = useThemeColor({}, 'text');
    const [isLoading, setIsLoading] = useState(false);
    const { accountInfo, credentialsBundle, keypair, email, logout } = useAuth();

    const { amount, recipient, name, type, title } = useLocalSearchParams<{
        amount: string;
        recipient: string;
        name: string;
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

            const connection = new Connection("https://api.devnet.solana.com");

            const source = {
                smart_account_address: accountInfo.smart_account_address,
                currency: 'Usdc' as Currency,
                authorities: [accountInfo.smart_account_signer_public_key],
            }

            const destination = {
                address: recipient,
                currency: 'Usdc' as Currency,
            }

            // Convert amount to USDC base units (multiply by 10^6)
            const amountInBaseUnits = Math.round(parseFloat(amount) * Math.pow(10, USDC_DECIMALS)).toString();

            const prepareTransactionParams: PreparePaymentIntentParams = {
                smartAccountAddress: accountInfo.smart_account_address,
                amount: amountInBaseUnits,
                grid_user_id: accountInfo.grid_user_id,
                idempotency_key: uuidv4(), // TODO: move to backend
                source,
                destination
            };

            const easClient = new EasClient();

            const res = await easClient.preparePaymentIntent(prepareTransactionParams);
            console.log("🚀 ~ handleConfirm ~ res:", res)

            if (!email) {
                logout();
                router.push({
                    pathname: '/(auth)/login',
                });

                return;
            }
            const userPublicKey = accountInfo.smart_account_signer_public_key;

            const decryptedData = decryptCredentialBundle(credentialsBundle, keypair.privateKey);
            const stamper = new TurnkeySuborgStamper(
                decryptedData,
                {
                    subOrganizationId: accountInfo.mpc_primary_id,
                    email: email,
                    publicKey: keypair.publicKey
                }
            );

            const userOrganizationId = accountInfo.mpc_primary_id;

            try {
                const signedTx = await signTransactionWithTurnkey({
                    encodedTx: res.data.transaction_hash,
                    stamper,
                    userOrganizationId,
                    userPublicKey
                });

                const tx = VersionedTransaction.deserialize(Buffer.from(signedTx, 'base64'));
                await connection.sendTransaction(tx);

            } catch (e) {
                console.error("Failed to sign transaction:", e);
                setIsLoading(false);
            }

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
        // Navigate to home
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
                        {renderInfo('arrow.forward', 'To', recipient)}
                        {renderInfo('person', 'Name', name)}
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
} const styles = StyleSheet.create({
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

