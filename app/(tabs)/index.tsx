import { Platform, StyleSheet, View, Image, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/molecules';
import { ThemedScreen } from '@/components/ui/layout';
import { TransferResponse, Transfer, Transaction, TransactionGroup } from '@/types/Transaction';
import { useAuth } from '@/contexts/AuthContext';
import { createSmartAccount } from '@/utils/smartAccount';
import { SendModal } from '@/components/ui/organisms/modals/SendModal';
import { ReceiveModal } from '@/components/ui/organisms/modals/ReceiveModal';
import { QRCodeModal } from '@/components/ui/organisms/modals/QRCodeModal';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { ComingSoonToast } from '@/components/ui/organisms/ComingSoonToast';
import { useComingSoonToast } from '@/hooks/useComingSoonToast';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { TransactionList } from '@/components/ui/organisms/TransactionList';
import { StorageService } from '@/utils/storage';
import { useWalletData } from '@/hooks/useWalletData';
import { MockDatabase } from '@/utils/mockDatabase';

const placeholder = require('@/assets/images/no-txn.png');

function HomeScreenContent() {
    const { accountInfo, setAccountInfo, logout } = useAuth();
    const { showReceiveModal, isReceiveModalVisible, hideAllModals } = useModalFlow();
    const [refreshing, setRefreshing] = useState(false);
    const [isSendModalVisible, setIsSendModalVisible] = useState(false);
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
    const { isVisible, message, showToast, hideToast } = useComingSoonToast();
    const { balance, transfers, isLoading, error, fetchWalletData } = useWalletData(accountInfo);

    useEffect(() => {
        if (!accountInfo || !accountInfo.smart_account_signer_public_key) {
            logout();
            return;
        }

        const initializeAccount = async () => {
            try {
                const account = await createSmartAccount(accountInfo);
                await StorageService.setItem(AUTH_STORAGE_KEYS.GRID_USER_ID, account.grid_user_id);
                await StorageService.setItem(AUTH_STORAGE_KEYS.SMART_ACCOUNT_ADDRESS, account.smart_account_address);

                // Only create user if they don't exist
                const existingUser = await MockDatabase.getUser(account.grid_user_id);
                if (!existingUser) {
                    await MockDatabase.createUser(account.grid_user_id);
                }

                const updatedAccountInfo = {
                    ...accountInfo,
                    smart_account_address: account.smart_account_address,
                    grid_user_id: account.grid_user_id
                };

                setAccountInfo(updatedAccountInfo);
                await fetchWalletData(updatedAccountInfo);
            } catch (err) {
                console.error('Error initializing account:', err);
            }
        };

        initializeAccount();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        const timeoutId = setTimeout(() => setRefreshing(false), 10000);

        try {
            await fetchWalletData();
        } finally {
            clearTimeout(timeoutId);
            setRefreshing(false);
        }
    }, [fetchWalletData]);

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

    const formatTransfers = (transfers: TransferResponse) => {
        const transfersToConsider = transfers.filter(transfer => ('Spl' in transfer && transfer.Spl.mint === process.env.EXPO_PUBLIC_USDC_MINT_ADDRESS && transfer.Spl.confirmation_status === 'confirmed') || ('Bridge' in transfer && transfer.Bridge.state === 'payment_processed'));

        const transactions = transfersToConsider.map(transfer => {
            if ('Spl' in transfer) {
                const splTransfer = transfer.Spl;

                return {
                    id: splTransfer.id,
                    amount: parseFloat(splTransfer.ui_amount),
                    status: splTransfer.confirmation_status,
                    type: splTransfer.from_address === accountInfo?.smart_account_address ? 'sent' as const : 'received' as const,
                    date: new Date(splTransfer.created_at),
                    address: splTransfer.from_address === accountInfo?.smart_account_address
                        ? splTransfer.to_address
                        : splTransfer.from_address
                } as Transaction;
            } else if ('Bridge' in transfer) {

                const type = transfer.Bridge.source_deposit_instructions?.from_address === accountInfo?.smart_account_address ? 'sent' as const : 'received' as const;

                return {
                    id: transfer.Bridge.id,
                    amount: parseFloat(transfer.Bridge.amount),
                    status: transfer.Bridge.state,
                    type: type,
                    date: new Date(transfer.Bridge.created_at),
                    address: type === 'sent' ? transfer.Bridge.destination.external_account_id : accountInfo?.smart_account_address
                } as Transaction;
            } else {
                console.log("🚀 ~ formatTransfers ~ unknown transfer:", transfer);
            }
        });


        // Group transactions by date
        const groups = transactions.reduce((acc: { [key: string]: Transaction[] }, transaction) => {
            if (!transaction) return acc;
            const date = transaction.date;
            const dateStr = date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            if (!acc[dateStr]) {
                acc[dateStr] = [];
            }
            acc[dateStr].push(transaction);
            return acc;
        }, {});

        // Convert to TransactionGroup array and sort by date
        return Object.entries(groups)
            .map(([title, data]) => ({
                title,
                data: data.sort((a, b) => b.date.getTime() - a.date.getTime())
            }))
            .sort((a, b) => {
                const dateA = new Date(a.data[0].date);
                const dateB = new Date(b.data[0].date);
                return dateB.getTime() - dateA.getTime();
            });
    };

    return (
        <ThemedScreen>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>

                        <ThemedText style={styles.headline}>Home · Balance</ThemedText>
                        <ThemedText type="highlight" style={styles.balanceTextStyle}>
                            {`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </ThemedText>
                        <CircleButtonGroup buttons={actions} />
                    </View>


                    {transfers.length > 0 ? (
                        <TransactionList
                            transactions={formatTransfers(transfers)}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Image
                                source={placeholder}
                                style={styles.placeholderImage}
                            />
                            <ThemedText type="regular">No transactions yet</ThemedText>
                        </View>
                    )}

                </ScrollView>
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
            </View>

        </ThemedScreen>
    );
}

export default function HomeScreen() {
    return <HomeScreenContent />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 60 : 50,
        minHeight: 300,
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
