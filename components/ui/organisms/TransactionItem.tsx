import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText, AppIcon, Chip } from '@/components/ui/atoms';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
interface TransactionItemProps {
    type: 'sent' | 'received' | 'bridge';
    date: string;
    amount: number;
    isLast?: boolean;
    address: string;
    status: string;
    onPress?: () => void;
}

export function TransactionItem({ type, date, amount, isLast, onPress, address, status }: TransactionItemProps) {
    const textColor = useThemeColor({}, 'text');

    // Determine which icon to use based on whether money was sent or received
    const iconName = type === 'sent' ? 'sent' : 'money-added';

    // Format wallet address with prefix and truncation
    const prefix = type === 'sent' ? 'To: ' : 'From: ';
    const truncatedAddress = address ? address.substring(0, 5) : '';
    const formattedAddress = `${prefix}${truncatedAddress}`;

    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <AppIcon name={iconName} size={34} />
            <View style={styles.details}>
                <ThemedText type="regular">{type}</ThemedText>
                <View style={styles.transactionDetails}>
                    <ThemedText type="tiny" >
                        {formattedAddress}
                    </ThemedText>
                    <ThemedText type="tiny" style={styles.date}> • {date}</ThemedText>
                    {/*<Chip
                        style={{
                            backgroundColor: `#000000` + 40,
                            ...styles.chip
                        }}
                        textStyle={styles.chipText}
                    >
                        {status.replace('payment_', '')}
                    </Chip>*/ }
                </View>
            </View>

            <ThemedText
                type="defaultSemiBold"
                style={[
                    styles.amount,
                    { color: type === 'sent' ? textColor : '#34C759' }
                ]}
            >
                {type === 'sent' ? '-' : '+'}${Math.abs(amount).toFixed(2)}
            </ThemedText>
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
    date: {
        opacity: 0.6,
    },
    amount: {
        textAlign: 'right',
    },
    transactionDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        borderWidth: 1,
        paddingVertical: 1,
        paddingHorizontal: 4,
        marginLeft: 5,
    },
    chipText: {
        fontSize: 7,
    }
}); 