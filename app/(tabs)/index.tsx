import { Platform, StyleSheet, View, Image, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/molecules';
import { TransactionList } from '@/components/ui/organisms';
import { ThemedScreen } from '@/components/ui/layout';
import { TransactionGroup } from '@/types/Transaction';
import { ActionModal } from '@/components/ui/organisms';
import { ModalOptionsList } from '@/components/ui/molecules';
import { ActionOption } from '@/components/ui/molecules/ModalOptionsList';
import { easClient } from '@/utils/easClient';
import { useAuth } from '@/contexts/AuthContext';
import { KycStatus } from '@/types/Kyc';
import WalletQRCode from '@/components/ui/organisms/WalletQRCode';
import { createSmartAccount } from '@/utils/smartAccount';

const placeholder = require('@/assets/images/no-txn.png');
const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

// TODO: Refactor Modals!!!!

export default function HomeScreen() {
    const { accountInfo, setAccountInfo } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [balance, setBalance] = useState(0);
    const [kycStatus, setKycStatus] = useState<KycStatus>('NotStarted');
    const [isSendModalVisible, setIsSendModalVisible] = useState(false);
    const [isReceiveModalVisible, setIsReceiveModalVisible] = useState(false);

    // Send modal handlers
    const openSendModal = () => setIsSendModalVisible(true);
    const closeSendModal = () => setIsSendModalVisible(false);

    // Receive modal handlers
    const openReceiveModal = () => setIsReceiveModalVisible(true);
    const closeReceiveModal = () => setIsReceiveModalVisible(false);

    // QR Code modal handlers
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
    const openQRCodeModal = () => setIsQRCodeModalVisible(true);
    const closeQRCodeModal = () => setIsQRCodeModalVisible(false);

    useEffect(() => {
        // Prevent running if not logged in
        if (!accountInfo! || !accountInfo.smart_account_signer_public_key) {

            return;
        }

        // If there is no grid_user_id, it means the smart account is not created yet
        if (!accountInfo.grid_user_id) {
            (async () => await createSmartAccount(accountInfo))();
        } else {
            updateBalance();
        }

        checkKycStatus();
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

    const checkKycStatus = async () => {
        setKycStatus('NotStarted');
    }

    // Send action handlers
    const handleSendToWallet = () => {
        closeSendModal();
        router.push({
            pathname: '/amount',
            params: {
                type: 'wallet',
                title: 'Send'
            }
        });
    };

    const handleSendToBank = () => {
        closeSendModal();
        router.push({
            pathname: '/(send)/amount',
            params: {
                type: 'bank',
                title: 'Send'
            }
        });
    };

    // Receive action handlers
    const handleReceiveToWallet = () => {
        closeReceiveModal();
        openQRCodeModal();
    };

    const handleReceiveFromBank = () => {
        closeReceiveModal();

        if (kycStatus !== 'Approved') {
            router.push('/(modals)/kyc');
        } else {
            router.push('/(modals)/create-bank-account');
        }
        // TODO: if bank account exists
    };

    // Define options for Send modal
    const sendOptions: ActionOption[] = [
        {
            key: 'wallet',
            title: 'To Wallet',
            description: 'Send assets to wallet address',
            icon: walletIcon,
            onPress: handleSendToWallet
        },
        {
            key: 'bank',
            title: 'To Bank Account',
            description: 'Send USDC to Bank Account',
            icon: bankIcon,
            onPress: handleSendToBank
        }
    ];

    // Define options for Receive modal
    const receiveOptions: ActionOption[] = [
        {
            key: 'wallet',
            title: 'Onchain',
            description: 'Receive via wallet address',
            icon: walletIcon,
            onPress: handleReceiveToWallet
        },
        {
            key: 'bank',
            title: 'Bank',
            description: 'Receive via bank transfer',
            icon: bankIcon,
            onPress: handleReceiveFromBank
        }
    ];

    // Explicitly type the actions array to ensure icon is a valid Ionicons name
    const actions: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
        {
            icon: 'add-outline',
            label: 'Add',
            onPress: openReceiveModal,
        },
        {
            icon: 'arrow-forward-outline',
            label: 'Send',
            onPress: openSendModal,
        },
        {
            icon: 'calendar-outline',
            label: 'Scheduled',
            onPress: () => { /* handle scheduled */ },
        },
        {
            icon: 'cash-outline',
            label: 'Invest',
            onPress: () => { /* handle pay */ },
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

                {/* Send Money Modal */}
                <ActionModal
                    visible={isSendModalVisible}
                    onClose={closeSendModal}
                    title="Send"
                >
                    <ModalOptionsList options={sendOptions} />
                </ActionModal>

                {/* Send Money Modal */}
                <ActionModal
                    visible={isReceiveModalVisible}
                    onClose={() => {
                        closeReceiveModal()
                    }}
                    title="Receive"
                >
                    <ModalOptionsList options={receiveOptions} />
                </ActionModal>

                {/* QR Code Modal */}
                <ActionModal
                    visible={isQRCodeModalVisible}
                    onClose={closeQRCodeModal}
                    useStarburstModal={true}
                >
                    <WalletQRCode walletAddress={accountInfo ? accountInfo.smart_account_address : ''} />
                </ActionModal>
            </ScrollView>
        </ThemedScreen>
    );
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

const transactionData: TransactionGroup[] = [

];
