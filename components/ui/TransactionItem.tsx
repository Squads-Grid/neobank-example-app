import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedScreenText } from './ThemedScreenText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';

interface TransactionItemProps {
    type: string;
    date: string;
    amount: number;
    isLast?: boolean;
}

export function TransactionItem({ type, date, amount, isLast }: TransactionItemProps) {
    const borderColor = useThemeColor({}, 'border');

    return (
        <View style={[
            styles.container,
            !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }
        ]}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.details}>
                <ThemedScreenText type="defaultSemiBold">{type}</ThemedScreenText>
                <ThemedScreenText type="default" style={styles.date}>{date}</ThemedScreenText>
            </View>
            <ThemedScreenText type="defaultSemiBold" style={styles.amount}>
                {amount < 0 ? '-' : '+'}${Math.abs(amount).toFixed(2)}
            </ThemedScreenText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: '#E5E5E5',
        borderRadius: 8,
    },
    details: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
    date: {
        marginTop: 2,
    },
    amount: {
        marginLeft: Spacing.sm,
    },
}); 