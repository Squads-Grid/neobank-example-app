import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/CircleButtonGroup';
import { TransactionList } from '@/components/ui/TransactionList';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { Transaction, TransactionGroup } from '@/types/Transaction';

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
    // {
    //     title: 'Today',
    //     data: [
    //         { id: '1', type: 'Transfer', date: '04. April', amount: -100.00 },
    //         { id: '2', type: 'Transfer', date: '04. April', amount: -100.00 },
    //         { id: '3', type: 'Transfer', date: '04. April', amount: -100.00 },
    //     ]
    // },
    // {
    //     title: 'Yesterday',
    //     data: [
    //         { id: '4', type: 'Transfer', date: '03. April', amount: -100.00 },
    //         { id: '5', type: 'Transfer', date: '03. April', amount: -100.00 },
    //         { id: '6', type: 'Transfer', date: '03. April', amount: -100.00 },
    //     ]
    // }
];

export default function HomeScreen() {
    return (
        <ThemedScreen>
            <ThemedScreenText style={styles.headline}>Home · Balance</ThemedScreenText>
            <ThemedScreenText style={styles.balanceTextStyle}>$3,456.94</ThemedScreenText>
            <CircleButtonGroup buttons={actions} />
            <View style={{ height: Spacing.xl }} />
            <TransactionList transactions={transactionData} />
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
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
});
