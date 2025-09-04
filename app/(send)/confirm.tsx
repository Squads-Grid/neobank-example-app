import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import { EasClient } from '@/utils/easClient';
import { PreparePaymentIntentParams, SmartAccount, SolanaAddress } from '@/types/Transaction';
import { ErrorCode } from '@/utils/errors';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native';
import { CreatePaymentIntentRequest } from '@sqds/grid';
import { SDKGridClient } from '../../grid/sdkClient';
import { StorageService } from '@/utils/storage';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';

// USDC has 6 decimals
const USDC_DECIMALS = 6;

export default function ConfirmScreen() {
    const textColor = useThemeColor({}, 'text');
    const [isLoading, setIsLoading] = useState(false);
    const { user, logout } = useAuth();

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
            const sessionSecrets = await StorageService.getItem(AUTH_STORAGE_KEYS.SESSION_SECRETS);
            if (!user || !user.address || !sessionSecrets) {
                logout();
                router.push({
                    pathname: '/(auth)/login',
                });

                return;
            }

            const prepareTransactionParams: CreatePaymentIntentRequest = {
                amount: (Number(amount) * 1000000).toString(), // Convert to USDC base units
                grid_user_id: user.grid_user_id!,
                source: {
                    account: user.address,
                    currency: "usdc"
                },
                destination: {
                    address: recipient,
                    currency: "usdc"
                }
            };

            const easClient = new EasClient();

            const transactionData = await easClient.preparePaymentIntent(prepareTransactionParams, user.address, true);

            if (!user) {
                logout();
                router.push({
                    pathname: '/(auth)/login',
                });

                return;
            }
            
            const gridClient = SDKGridClient.getFrontendClient();

            const signedPayload = await gridClient.sign({
                sessionSecrets: sessionSecrets as any,
                session: user.authentication,
                transactionPayload: transactionData.data.transactionPayload!
              })

              const payload = {
                signedTransactionPayload: signedPayload,
                address: user.address
              }

            const signature = await easClient.confirmPaymentIntent(payload);
            router.push({
                pathname: '/success',
                params: { amount, type, title },
            });

        } catch (error: any) {

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

            Sentry.captureException(new Error(`Failed to confirm payment: ${error}. (send)/confirm.tsx (handleConfirm)`));
            setIsLoading(false);
            throw error;
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
                        {/* {renderInfo('network', 'Network fee', '0.0004 SOL')} */}
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

