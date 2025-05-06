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
import { VersionedTransaction, TransactionMessage, PublicKey, Connection } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountIdempotentInstruction, createTransferInstruction } from '@solana/spl-token';

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
            console.log("🚀 ~ handleConfirm ~ accountInfo:", accountInfo);
            console.log("🚀 ~ handleConfirm ~ credentialsBundle:", credentialsBundle);
            console.log("🚀 ~ handleConfirm ~ keypair:", keypair);
            if (!accountInfo || !credentialsBundle || !keypair) {
                console.log("Missing auth data:", { accountInfo, credentialsBundle, keypair });
                logout();
                router.push({
                    pathname: '/(auth)/login',
                });
                return;
            }

            const connection = new Connection("https://api.devnet.solana.com");
            const recentBlockhash = await connection.getLatestBlockhash();

            // Create USDC transfer instructions
            const fromPublicKey = new PublicKey(accountInfo.smart_account_address);
            const toPublicKey = new PublicKey(recipient);
            const usdcMint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
            const fromTokenAccount = await getAssociatedTokenAddress(usdcMint, fromPublicKey);
            const toTokenAccount = await getAssociatedTokenAddress(usdcMint, toPublicKey);

            const instructions = [
                createAssociatedTokenAccountIdempotentInstruction(
                    fromPublicKey,
                    toTokenAccount,
                    toPublicKey,
                    usdcMint
                ),
                createTransferInstruction(
                    fromTokenAccount,
                    toTokenAccount,
                    fromPublicKey,
                    Number(amount) * 10 ** 6
                )
            ];

            // Create and compile the transaction message
            const messageV0 = new TransactionMessage({
                payerKey: fromPublicKey,
                recentBlockhash: recentBlockhash.blockhash,
                instructions
            }).compileToV0Message();

            const transaction = new VersionedTransaction(messageV0);
            const encodedTransaction = Buffer.from(transaction.serialize()).toString('base64');

            if (!email) {
                logout();
                router.push({
                    pathname: '/(auth)/login',
                });
                return;
            }

            // Create the stamper
            const stamper = new TurnkeySuborgStamper(keypair.privateKey, {
                subOrganizationId: accountInfo.user_id,
                email: email,
                publicKey: keypair.publicKey
            });

            const signedTx = await signTransactionWithTurnkey({
                encodedTx: encodedTransaction,
                stamper,
                userOrganizationId: accountInfo.user_id,
                userPublicKey: keypair.publicKey,
            });

            // TODO: Broadcast `signedTx` to the Solana network
            console.log(signedTx);

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