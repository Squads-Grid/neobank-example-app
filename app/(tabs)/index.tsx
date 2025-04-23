import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/CircleButtonGroup';
import { TransactionList } from '@/components/ui/TransactionList';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { Transaction, TransactionGroup } from '@/types/Transaction';
import { Image } from 'react-native';

const placeholder = require('@/assets/images/no-txn.png');

const actions: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
    {
        icon: 'add-outline',
        label: 'Add Money',
        onPress: () => { /* handle add money */ },
    },
    {
        icon: 'arrow-forward-outline',
        label: 'Send Money',
        onPress: () => { /* handle send money */ },
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

export default function HomeScreen() {
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
