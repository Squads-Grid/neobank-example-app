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
import { ActionModal, ActionOption } from '@/components/ui/ActionModal';

const placeholder = require('@/assets/images/no-txn.png');
const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

export default function HomeScreen() {
    const [isSendModalVisible, setIsSendModalVisible] = useState(false);
    const [isReceiveModalVisible, setIsReceiveModalVisible] = useState(false);

    // Send modal handlers
    const openSendModal = () => setIsSendModalVisible(true);
    const closeSendModal = () => setIsSendModalVisible(false);

    // Receive modal handlers
    const openReceiveModal = () => setIsReceiveModalVisible(true);
    const closeReceiveModal = () => setIsReceiveModalVisible(false);

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
            pathname: '/amount',
            params: {
                type: 'bank',
                title: 'Send'
            }
        });
    };

    // Receive action handlers
    const handleReceiveToWallet = () => {
        closeReceiveModal();
        router.push({
            pathname: '/amount',
            params: {
                type: 'wallet',
                title: 'Receive'
            }
        });
    };

    const handleReceiveFromBank = () => {
        closeReceiveModal();
        router.push({
            pathname: '/amount',
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

    return (
        <ThemedScreen>
            <ThemedScreenText style={styles.headline}>Home · Balance</ThemedScreenText>
            <ThemedScreenText style={styles.balanceTextStyle}>$3,456.94</ThemedScreenText>
            <CircleButtonGroup buttons={actions} />
            <View style={{ height: Spacing.xl }} />
            {transactionData.length > 0 ? <TransactionList transactions={transactionData} /> : (
                <View style={styles.emptyContainer}>
                    <Image
                        source={placeholder}
                        style={styles.placeholderImage}
                    />
                    <ThemedScreenText style={styles.placeholderText}>No transactions yet</ThemedScreenText>
                </View>
            )}

            {/* Send Money Modal */}
            <ActionModal
                visible={isSendModalVisible}
                onClose={closeSendModal}
                title="Send"
                options={sendOptions}
            />

            {/* Receive Money Modal */}
            <ActionModal
                visible={isReceiveModalVisible}
                onClose={closeReceiveModal}
                title="Receive"
                options={receiveOptions}
            />
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
        fontSize: 16,
        opacity: 0.3,
        textAlign: 'center',
        lineHeight: 19.2,
        marginTop: Spacing.xl,
    },
    balanceTextStyle: {
        fontSize: 56,
        lineHeight: 67.2,
        marginTop: Spacing.sm,
        marginBottom: Spacing.lg,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    placeholderImage: {
        height: 46,
        resizeMode: 'contain',
    },
    placeholderText: {
        marginTop: Spacing.lg,
        textAlign: 'center',
        fontSize: 14,
        opacity: 0.23,
    }
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
