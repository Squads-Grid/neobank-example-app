import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { router } from 'expo-router';

import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/CircleButtonGroup';
import { TransactionList } from '@/components/ui/TransactionList';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { Transaction, TransactionGroup } from '@/types/Transaction';
import { Image } from 'react-native';
import { ActionModal } from '@/components/ui/ActionModal';
import { ModalOptionsList, ActionOption } from '@/components/ui/ModalOptionsList';
import QRCode from 'react-native-qrcode-svg';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Height, Size, Weight } from '@/constants/Typography';

const placeholder = require('@/assets/images/no-txn.png');
const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

const SOLANA_ADDRESS = "5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerVnZgX37B";

export default function HomeScreen() {
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

        router.push({
            pathname: '/(receive)/bankdetails',
            params: {
                type: 'bank',
                title: 'Receive'
            }
        });
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
            <ThemedScreenText style={styles.headline}>Home · Balance</ThemedScreenText>
            <ThemedScreenText type="highlight" style={styles.balanceTextStyle}>$3,456.94</ThemedScreenText>
            <CircleButtonGroup buttons={actions} />
            <View style={{ height: Spacing.xl }} />
            {transactionData.length > 0 ? <TransactionList transactions={transactionData} /> : (
                <View style={styles.emptyContainer}>
                    <Image
                        source={placeholder}
                        style={styles.placeholderImage}
                    />
                    <ThemedScreenText type="regular">No transactions yet</ThemedScreenText>
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
                    <ThemedScreenText type="large" style={[styles.qrCodeHeadline, { color: 'white' }]}>Bright</ThemedScreenText>
                    {renderQRCode()}
                    <ThemedScreenText type="default" style={styles.qrCodeAddress}>{SOLANA_ADDRESS}</ThemedScreenText>
                    <View style={styles.qrCodeSupportContainer}>
                        <IconSymbol name="info.circle" size={16} color="white" />
                        <ThemedScreenText type="tiny" style={styles.qrCodeSupportText}>We don't support NFTs.</ThemedScreenText>
                    </View>
                    <View style={styles.qrCodeCopyContainer}>
                        <IconSymbol name="doc.on.doc" size={16} color="white" />
                        <ThemedScreenText type="regularSemiBold" style={styles.qrCodeCopyText}>Copy</ThemedScreenText>
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
    placeholderText: {
        marginTop: Spacing.lg,
        textAlign: 'center',
        opacity: 0.23,
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
    {
        title: 'Today',
        data: [
            {
                id: '1',
                type: 'Money Added',
                date: 'April 4',
                amount: +100.00,
                walletAddress: '5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerVnZgX37B'
            },
            {
                id: '2',
                type: 'Transfer',
                date: 'April 4',
                amount: -100.00,
                walletAddress: 'GsbwXfJUJimiJWeSmFhRnWxvuPcFNQS8gQxLxNpzBxr9'
            },
            {
                id: '3',
                type: 'Payment',
                date: 'April 4',
                amount: -100.00,
                walletAddress: 'DEhAasscXF4kEGxFgJ3bq4PpVGp5wyUxMRvn6TzGVHaw'
            },
        ]
    },
    {
        title: 'Yesterday',
        data: [
            {
                id: '4',
                type: 'Money Added',
                date: 'April 3',
                amount: +100.00,
                walletAddress: '5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerVnZgX37B'
            },
            {
                id: '5',
                type: 'Received',
                date: 'April 3',
                amount: +100.00,
                walletAddress: 'HAWy8kV3bD4gHn6gV3KBQvNJB8fJoU7Va2cmT4U4storm'
            },
            {
                id: '6',
                type: 'Transfer',
                date: 'April 3',
                amount: -100.00,
                walletAddress: '9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde'
            },
            {
                id: '7',
                type: 'Coffee',
                date: 'April 3',
                amount: -100.00,
                walletAddress: 'EWmowPNdC9VHMRPM37usiKsNwXnhXNTLL2v4BQvnjeV5'
            },
            {
                id: '8',
                type: 'Rent',
                date: 'April 3',
                amount: +100.00,
                walletAddress: 'So11111111111111111111111111111111111111112'
            },
            {
                id: '9',
                type: 'Groceries',
                date: 'April 3',
                amount: -100.00,
                walletAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
            },
        ]
    }
];
