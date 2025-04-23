import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedScreenText } from './ThemedScreenText';
import { TransactionItem } from './TransactionItem';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TransactionGroup } from '@/types/Transaction';

interface TransactionListProps {
    transactions: TransactionGroup[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    const borderColor = useThemeColor({}, 'border');
    const backgroundColor = useThemeColor({}, 'background');

    return (
        <ScrollView style={styles.container}>
            {transactions.map((group, index) => (
                <View key={index} style={styles.groupContainer}>
                    <ThemedScreenText type="subtitle" style={styles.groupTitle}>
                        {group.title}
                    </ThemedScreenText>
                    <View style={[styles.group, { borderColor, backgroundColor }]}>
                        {group.data.map((transaction, idx) => (
                            <TransactionItem
                                key={transaction.id}
                                type={transaction.type}
                                date={transaction.date}
                                amount={transaction.amount}
                                isLast={idx === group.data.length - 1}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    groupContainer: {
        marginBottom: Spacing.md,
    },
    groupTitle: {
        paddingVertical: Spacing.xs,
    },
    group: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
}); 