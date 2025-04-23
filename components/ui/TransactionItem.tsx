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
    walletAddress: string;
    onPress?: () => void;
}

export function TransactionItem({ type, date, amount, isLast, onPress, walletAddress }: TransactionItemProps) {
    const textColor = useThemeColor({}, 'text');

    // Determine which icon to use based on whether money was sent or received
    const iconName = amount < 0 ? 'sent' : 'money-added';

    // Format wallet address with prefix and truncation
    const prefix = amount < 0 ? 'To: ' : 'From: ';
    const truncatedAddress = walletAddress.substring(0, 5);
    const formattedAddress = `${prefix}${truncatedAddress}`;

    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <AppIcon name={iconName} size={34} />
            <View style={styles.details}>
                <ThemedScreenText type="defaultSemiBold" style={styles.type}>{type}</ThemedScreenText>
                <View style={styles.transactionDetails}>
                    <ThemedScreenText type="default" style={[styles.address]}>
                        {formattedAddress}
                    </ThemedScreenText>
                    <ThemedScreenText type="default" style={styles.date}> • {date}</ThemedScreenText>
                </View>
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
        paddingHorizontal: Spacing.md,
        backgroundColor: 'transparent',
        paddingVertical: Spacing.md,
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
    address: {
        fontSize: 12,
        lineHeight: 12,
        fontWeight: '500',
    },
    amount: {
        fontSize: 14,
        textAlign: 'right',
    },
    transactionDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    }
}); 