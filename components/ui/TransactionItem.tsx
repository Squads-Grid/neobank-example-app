import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedScreenText } from './ThemedScreenText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { AppIcon } from './AppIcon';

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

    // Determine which icon to use based on whether money was sent or received
    const iconName = amount < 0 ? 'sent' : 'money-added';

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor },
                pressed && { backgroundColor: highlightColor }
            ]}
            onPress={onPress}
        >

            <AppIcon name={iconName} size={34} />
            <View style={styles.details}>
                <ThemedScreenText type="defaultSemiBold" style={styles.type}>{type}</ThemedScreenText>
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
        backgroundColor: 'transparent',
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#E5E5E5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        flex: 1,
        flexDirection: 'column',
        height: 34,
        marginLeft: 10,
        justifyContent: 'space-between',
        paddingTop: 2,
    },
    type: {
        fontSize: 14,
        lineHeight: 14,
    },
    date: {
        opacity: 0.6,
        fontSize: 12,
        lineHeight: 12,
    },
    amount: {
        fontSize: 14,
        textAlign: 'right',
    },
}); 