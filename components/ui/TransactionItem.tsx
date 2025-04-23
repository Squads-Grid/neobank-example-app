import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedScreenText } from './ThemedScreenText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';

interface TransactionItemProps {
    type: string;
    date: string;
    amount: number;
    isLast?: boolean;
    onPress?: () => void;
}

export function TransactionItem({ type, date, amount, isLast, onPress }: TransactionItemProps) {
    const borderColor = useThemeColor({}, 'border');
    const highlightColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor },
                pressed && { backgroundColor: highlightColor }
            ]}
            onPress={onPress}
        >
            <View style={styles.iconPlaceholder} />
            <View style={styles.details}>
                <ThemedScreenText type="defaultSemiBold">{type}</ThemedScreenText>
                <ThemedScreenText type="default" style={styles.date}>{date}</ThemedScreenText>
            </View>
            <ThemedScreenText
                type="defaultSemiBold"
                style={[
                    styles.amount,
                    { color: amount < 0 ? textColor : '#34C759' }
                ]}
            >
                {amount < 0 ? '' : '+'}${Math.abs(amount).toFixed(2)}
            </ThemedScreenText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: 'transparent', // Important for the pressed state
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
        opacity: 0.6,
    },
    amount: {
        marginLeft: Spacing.sm,
    },
}); 