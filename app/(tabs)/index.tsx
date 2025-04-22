import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ui/ThemedText';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Spacing } from '@/constants/Spacing';
import { CircleButtonGroup } from '@/components/ui/CircleButtonGroup';
import { TransactionList } from '@/components/ui/TransactionList';

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
];

const transactionData = [
    {
        title: 'Today',
        data: [
            { id: '1', type: 'Transfer', date: '04. April', amount: -100.00 },
            { id: '2', type: 'Transfer', date: '04. April', amount: -100.00 },
            { id: '3', type: 'Transfer', date: '04. April', amount: -100.00 },
        ]
    },
    {
        title: 'Yesterday',
        data: [
            { id: '4', type: 'Transfer', date: '03. April', amount: -100.00 },
            { id: '5', type: 'Transfer', date: '03. April', amount: -100.00 },
            { id: '6', type: 'Transfer', date: '03. April', amount: -100.00 },
        ]
    }
];

export default function HomeScreen() {
    return (
        <ScreenLayout>
            <ThemedText type="title">Home</ThemedText>
            <ThemedText style={styles.balanceTextStyle}>$3,456.94</ThemedText>
            <CircleButtonGroup buttons={actions} />
            <View style={{ height: Spacing.xl }} />
            <TransactionList transactions={transactionData} />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    balanceTextStyle: {
        fontSize: 40,
        lineHeight: 40,
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
});
