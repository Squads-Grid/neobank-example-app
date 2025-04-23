import React from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import { ThemedScreenText } from './ThemedScreenText';
import { TransactionItem } from './TransactionItem';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Transaction, TransactionGroup } from '@/types/Transaction';

interface TransactionListProps {
    transactions: TransactionGroup[];
}

export function TransactionList({ transactions }: TransactionListProps) {

    // Use a very light tint of the text color (or any contrasting color you prefer)
    const sectionHeaderBg = useThemeColor({}, 'background');

    const renderSectionHeader = ({ section }: { section: TransactionGroup }) => (
        <View style={[styles.sectionHeaderContainer, { backgroundColor: sectionHeaderBg }]}>
            <ThemedScreenText type="subtitle" style={styles.groupTitle}>
                {section.title}
            </ThemedScreenText>
        </View>
    );

    const renderItem = ({ item, index, section }: {
        item: Transaction;
        index: number;
        section: TransactionGroup
    }) => (
        <TransactionItem
            key={item.id}
            type={item.type}
            date={item.date}
            amount={item.amount}
            walletAddress={item.walletAddress}
            isLast={index === section.data.length - 1}
        />
    );

    return (
        <SectionList
            style={styles.container}
            sections={transactions}
            keyExtractor={(item) => item.id}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={() => (
                <ThemedScreenText style={styles.emptyText}>
                    No transactions yet
                </ThemedScreenText>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: Spacing.lg,
    },
    sectionHeaderContainer: {
        paddingTop: Spacing.xl,
        paddingHorizontal: Spacing.md,
        zIndex: 1,
    },
    groupTitle: {
        fontWeight: '600',
        fontSize: 16,
        opacity: 0.23,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: Spacing.xl,
        opacity: 0.5,
    },
}); 