import { Platform, StyleSheet, View, Image } from 'react-native';
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
import { useBalance } from '@/contexts/BalanceContext';
import { easClient } from '@/utils/easClient';
import { CreateSmartAccountRequest, Policies, WalletAccount, Permission } from '@/types/SmartAccounts';
import { useAuth } from '@/contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

const placeholder = require('@/assets/images/no-txn.png');
const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

// TODO: Refactor!!!!

const SOLANA_ADDRESS = "5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerVnZgX37B";

// Map Stage from the context to BankStatus enum
// This ensures backward compatibility with existing code
enum BankStatus {
    NEW = 'new',
    KYC = 'kyc',
    FINISHED = 'finished'
}

export default function HomeScreen() {
    const { stage } = useStage();
    const { balance, isLoading, error } = useBalance();
    const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const { wallet, suborgInfo } = useAuth();

    // Convert Stage type to BankStatus enum
    const getBankStatus = (stageValue: Stage): BankStatus => {
        switch (stageValue) {
            case 'new': return BankStatus.NEW;
            case 'kyc': return BankStatus.KYC;
            case 'finished': return BankStatus.FINISHED;
            default: return BankStatus.NEW;
        }
    };

    useEffect(() => {
        const getUserId = async () => {
            // TODO: Replace saving gridUserId
            const gridUserId = await SecureStore.getItemAsync('gridUserId');
            setUserId(gridUserId);

            if (!gridUserId && wallet && suborgInfo) {
                console.log('🚀 Couldn\'t find gridUserId,thus creating smart account');
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
                    turnkey_wallet_account: {
                        wallet_id: suborgInfo.wallet_id,
                        wallet_address: wallet
                    }
                };

                (async () => {
                    const response = await easClient.createSmartAccount(request);
                    console.log(response);
                    const data = response.data;
                    await SecureStore.setItemAsync('gridUserId', data.grid_user_id);
                    setSmartAccountAddress(data.smart_account_address);
                })();
            } else {
                console.log('🚀 Found gridUserId,thus not creating smart account');
            }
        }
        getUserId();


    }, [wallet]);

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
            label: 'Add Money',
            onPress: openReceiveModal,
        },
        {
            icon: 'arrow-forward-outline',
            label: 'Send Money',
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
                value={SOLANA_ADDRESS}
                size={250}
                color="white"
                backgroundColor="#000033"
                ecl="H" // Error correction level - H is highest
            />
        );
    }

    return (
        <ThemedScreen>
            <ThemedText style={styles.headline}>Home · Balance</ThemedText>
            <ThemedText type="highlight" style={styles.balanceTextStyle}>
                {isLoading ? '...' : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
                    <ThemedText type="default" style={styles.qrCodeAddress}>{SOLANA_ADDRESS}</ThemedText>
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
