import { Platform, StyleSheet, View, Image, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';

import { ThemedText, IconSymbol } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/molecules';
import { TransactionList } from '@/components/ui/organisms';
import { ThemedScreen } from '@/components/ui/layout';
import { TransactionGroup } from '@/types/Transaction';
import { ActionModal } from '@/components/ui/organisms';
import { ModalOptionsList } from '@/components/ui/molecules';
import { ActionOption } from '@/components/ui/molecules/ModalOptionsList';
import QRCode from 'react-native-qrcode-svg';
import { useStage } from '@/contexts/StageContext';
import { Stage } from '@/components/devtools/StageSelector';
import { easClient } from '@/utils/easClient';
import { CreateSmartAccountRequest, Policies, WalletAccount, Permission } from '@/types/SmartAccounts';
import { useAuth } from '@/contexts/AuthContext';
import { TokenBalance } from '@/types/SmartAccounts';

const placeholder = require('@/assets/images/no-txn.png');
const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

// TODO: Refactor!!!!

// Map Stage from the context to BankStatus enum
// This ensures backward compatibility with existing code
enum BankStatus {
    NEW = 'new',
    KYC = 'kyc',
    FINISHED = 'finished'
}

export default function HomeScreen() {
    const { stage } = useStage();
    const { wallet, accountInfo, setAccountInfo } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [balance, setBalance] = useState(0);

    // Convert Stage type to BankStatus enum
    const getBankStatus = (stageValue: Stage): BankStatus => {
        switch (stageValue) {
            case 'new': return BankStatus.NEW;
            case 'kyc': return BankStatus.KYC;
            case 'finished': return BankStatus.FINISHED;
            default: return BankStatus.NEW;
        }
    };

    const updateBalance = (balances: TokenBalance[]) => {
        if (balances.length === 0) {
            setBalance(0);
        } else {
            const usdcBalance = balances.find((balance: any) => balance.token_address === '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
            if (usdcBalance) {
                setBalance(parseFloat(parseFloat(usdcBalance.amount_decimal).toFixed(2)));
            }
        }
    }

    useEffect(() => {
        const getUserId = async () => {
            console.log("🚀 ~ getUserId ~ accountInfo:", accountInfo)
            // Prevent running if not logged in
            if (!accountInfo || !wallet) {

                return;
            }

            if (!accountInfo.smart_account_address) {
                console.log("🚀 ~ getUserId ~ creating smart account")

                const request = {
                    policies: {
                        signers: [{
                            address: wallet,
                            permissions: ['CAN_INITIATE', 'CAN_VOTE', 'CAN_EXECUTE'] as Permission[]
                        }],
                        admin_address: null,
                        threshold: 1,
                        grid_user_id: null,
                    },
                    memo: '',
                    grid_user_id: null,
                    wallet_account: {
                        wallet_id: accountInfo.wallet_id,
                        wallet_address: wallet
                    },
                    user_id: accountInfo.user_id
                };

                (async () => {
                    const response = await easClient.createSmartAccount(request);
                    const data = response.data;
                    console.log("🚀 ~ data:", data)
                    setAccountInfo({
                        ...accountInfo,
                        smart_account_address: data.smart_account_address
                    });
                })();
            } else {
                console.log("🚀 ~ getUserId ~ getting balance")
                const result = await easClient.getBalance({ smartAccountAddress: accountInfo.smart_account_address });
                updateBalance(result.balances);
            }
        }
        getUserId();
    }, [wallet, accountInfo, setAccountInfo]);

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

        const bankStatus = getBankStatus(stage);

        // Demo/Development feature: Using stage from context to determine app flow
        switch (bankStatus) {
            case BankStatus.NEW:
                router.push('/(modals)/create-bank-account');
                break;
            case BankStatus.KYC:
                router.push('/(modals)/kyc');
                break;
            case BankStatus.FINISHED:
                router.push('/(modals)/bankdetails?currency=EUR');
                break;
        }
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

    const renderQRCode = () => {
        return (
            <QRCode
                value={accountInfo?.smart_account_address}
                size={250}
                color="white"
                backgroundColor="#000033"
                ecl="H" // Error correction level - H is highest
            />
        );
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        if (accountInfo?.smart_account_address) {
            const result = await easClient.getBalance({ smartAccountAddress: accountInfo.smart_account_address });
            updateBalance(result.balances);
        }

        setRefreshing(false);
    }, [accountInfo]);

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
                    <View style={styles.qrCodeContainer}>
                        <ThemedText type="large" style={[styles.qrCodeHeadline, { color: 'white' }]}>Bright</ThemedText>
                        {renderQRCode()}
                        <ThemedText type="default" style={styles.qrCodeAddress}>{accountInfo?.smart_account_address}</ThemedText>
                        <View style={styles.qrCodeSupportContainer}>
                            <IconSymbol name="info.circle" size={16} color="white" />
                            <ThemedText type="tiny" style={styles.qrCodeSupportText}>We don't support NFTs.</ThemedText>
                        </View>
                        <View style={styles.qrCodeCopyContainer}>
                            <IconSymbol name="doc.on.doc" size={16} color="white" />
                            <ThemedText type="regularSemiBold" style={styles.qrCodeCopyText}>Copy</ThemedText>
                        </View>
                    </View>
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
    qrCodeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    qrCodeHeadline: {
        marginBottom: Spacing.lg
    },
    qrCodeCopyText: {
        color: 'white',
        marginLeft: Spacing.xs
    },
    qrCodeCopyContainer: {
        flexDirection: 'row',
        marginTop: Spacing.xl,
    },
    qrCodeSupportContainer: {
        flexDirection: 'row',
        marginTop: Spacing.md,
        opacity: 0.4
    },
    qrCodeSupportText: {
        color: 'white',
        marginLeft: Spacing.xxs
    },
    qrCodeAddress: {
        color: 'white',
        marginTop: Spacing.lg,
        textAlign: 'center'
    },
});

const transactionData: TransactionGroup[] = [

];
