import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ui/atoms';
import { TransactionItem } from './TransactionItem';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TransactionGroup } from '@/types/Transaction';

interface TransactionListProps {
    transactions: TransactionGroup[];
    onRefresh?: () => void;
    refreshing?: boolean;
}

export function TransactionList({ transactions, onRefresh, refreshing }: TransactionListProps) {
    const sectionHeaderBg = useThemeColor({}, 'background');

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing || false}
                        onRefresh={onRefresh}
                    />
                ) : undefined}
            >
                {transactions.length === 0 ? (
                    <ThemedText style={styles.emptyText}>
                        No transactions yet
                    </ThemedText>
                ) : (
                    transactions.map((section) => (
                        <View key={section.title}>
                            <View style={[styles.sectionHeaderContainer, { backgroundColor: sectionHeaderBg }]}>
                                <ThemedText type="defaultSemiBold" style={styles.groupTitle}>
                                    {section.title}
                                </ThemedText>
                            </View>
                            {section.data.map((item, index) => (
                                <TransactionItem
                                    key={item.id}
                                    type={item.type}
                                    date={item.date.toLocaleDateString()}
                                    amount={item.amount}
                                    address={item.address}
                                    isLast={index === section.data.length - 1}
                                    status={item.status}
                                />
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    sectionHeaderContainer: {
        paddingTop: Spacing.xl,
        paddingHorizontal: Spacing.md,
        zIndex: 1,
    },
    groupTitle: {
        opacity: 0.23,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: Spacing.xl,
        opacity: 0.5,
    },
}); 