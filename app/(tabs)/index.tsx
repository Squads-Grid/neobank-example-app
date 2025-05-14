import { Platform, StyleSheet, View, Image, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/molecules';
import { TransactionList } from '@/components/ui/organisms';
import { ThemedScreen } from '@/components/ui/layout';
import { TransactionGroup } from '@/types/Transaction';
import { useAuth } from '@/contexts/AuthContext';
import { createSmartAccount } from '@/utils/smartAccount';
import { SendModal } from '@/components/ui/organisms/modals/SendModal';
import { ReceiveModal } from '@/components/ui/organisms/modals/ReceiveModal';
import { QRCodeModal } from '@/components/ui/organisms/modals/QRCodeModal';
import { easClient } from '@/utils/easClient';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { ComingSoonToast } from '@/components/ui/organisms/ComingSoonToast';
import { useComingSoonToast } from '@/hooks/useComingSoonToast';

const placeholder = require('@/assets/images/no-txn.png');

function HomeScreenContent() {
    const { accountInfo, setAccountInfo, logout } = useAuth();
    const { showReceiveModal, isReceiveModalVisible, hideAllModals } = useModalFlow();
    const [refreshing, setRefreshing] = useState(false);
    const [balance, setBalance] = useState(0);
    const [isSendModalVisible, setIsSendModalVisible] = useState(false);
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
    const { isVisible, message, showToast, hideToast } = useComingSoonToast();

    useEffect(() => {
        if (!accountInfo || !accountInfo.smart_account_signer_public_key) {

            return;
        }

        if (!accountInfo.grid_user_id) {
            (async () => {
                let account = await createSmartAccount(accountInfo)
                setAccountInfo(account);
                updateBalance();
                fetchTransactions();
            })();
        } else {
            updateBalance();
            fetchTransactions();
        }
    }, [accountInfo, setAccountInfo]);

    const updateBalance = async () => {
        if (!accountInfo) {
            console.error('Account info not found');
            return;
        }

        const result = await easClient.getBalance({ smartAccountAddress: accountInfo.smart_account_address });
        const balances = result.balances;

        if (balances.length === 0) {
            setBalance(0);
        } else {
            // TODO: add usdc address for devent and mainnet to env
            const usdcBalance = balances.find((balance: any) => balance.token_address === '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
            if (usdcBalance) {
                setBalance(parseFloat(parseFloat(usdcBalance.amount_decimal).toFixed(2)));
            }
        }
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        if (accountInfo?.smart_account_address) {
            updateBalance();
        }
        setRefreshing(false);
    }, [accountInfo]);

    const fetchTransactions = async () => {
        if (accountInfo?.smart_account_address) {
            const result = await easClient.getTransfers(accountInfo.smart_account_address);
        }
    }

    const actions: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
        {
            icon: 'add-outline',
            label: 'Add',
            onPress: showReceiveModal,
        },
        {
            icon: 'arrow-forward-outline',
            label: 'Send',
            onPress: () => setIsSendModalVisible(true),
        },
        {
            icon: 'calendar-outline',
            label: 'Scheduled',
            onPress: () => showToast("Scheduled payments coming soon!"),
        },
        {
            icon: 'cash-outline',
            label: 'Invest',
            onPress: () => showToast("Investment features coming soon!"),
        }
    ];

    return (
        <ThemedScreen>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ThemedText style={styles.headline}>Home · Balance</ThemedText>
                <ThemedText type="highlight" style={styles.balanceTextStyle}>
                    {`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </ThemedText>
                <CircleButtonGroup buttons={actions} />
                <View style={{ height: Spacing.xl }} />
                {transactionData.length > 0 ? <TransactionList transactions={transactionData} /> : (
                    <View style={styles.emptyContainer}>
                        <Image
                            source={placeholder}
                            style={styles.placeholderImage}
                        />
                        <ThemedText type="regular">No transactions yet</ThemedText>
                    </View>
                )}

                <SendModal
                    visible={isSendModalVisible}
                    onClose={() => setIsSendModalVisible(false)}
                />

                <ReceiveModal
                    visible={isReceiveModalVisible}
                    onClose={hideAllModals}
                    onOpenQRCode={() => setIsQRCodeModalVisible(true)}
                />

                <QRCodeModal
                    visible={isQRCodeModalVisible}
                    onClose={() => setIsQRCodeModalVisible(false)}
                    walletAddress={accountInfo?.smart_account_address || ''}
                />

                <ComingSoonToast
                    visible={isVisible}
                    onHide={hideToast}
                    message={message}
                />
            </ScrollView>
        </ThemedScreen>
    );
}

export default function HomeScreen() {
    return <HomeScreenContent />;
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 60 : 50,
    },
    headline: {
        opacity: 0.3,
        textAlign: 'center',
        marginTop: Spacing.xl,
    },
    balanceTextStyle: {
        marginTop: Spacing.sm,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    placeholderImage: {
        height: 46,
        resizeMode: 'contain',
    },
});

const transactionData: TransactionGroup[] = [];
