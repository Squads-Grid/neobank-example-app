import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { formatAmount } from '@/utils/helper';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ButtonGroup } from '@/components/ui/ButtonGroup';
import { Height, Size, Weight } from '@/constants/Typography';

export default function ConfirmScreen() {
    const textColor = useThemeColor({}, 'text');

    const { amount, recipient, name, type, title } = useLocalSearchParams<{
        amount: string;
        recipient: string;
        name: string;
        type: string;
        title: string;
    }>();

    const handleConfirm = () => {
        // Handle confirmation logic
        console.log('Confirmed:', { amount, recipient, name, type, title });

        // Navigate to success screen
        router.push({
            pathname: '/success',
            params: { amount, type, title }
        });
    };

    const handleCancel = () => {

        // Navigate to home
        router.push({
            pathname: '/(tabs)',
            params: { amount, type, title }
        });
    };

    const renderInfo = (icon: IconSymbolName, label: string, value: string) => {
        const iconColor = textColor + '40';
        return (
            <View>
                <View style={styles.labelContainer}>
                    <IconSymbol name={icon} size={16} color={iconColor} />
                    <ThemedScreenText type="defaultSemiBold" style={[styles.labelText, { color: iconColor }]}>{label}</ThemedScreenText>

                </View>
                <ThemedScreenText type="default" style={styles.infoText}>{value}</ThemedScreenText>
            </View>
        )
    }

    return (
        <ThemedScreen useSafeArea={true} safeAreaEdges={['bottom', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.content}>

                    <ThemedScreenText type="defaultSemiBold" style={styles.label}>Amount</ThemedScreenText>
                    <ThemedScreenText type="default" style={styles.amountText}>{formatAmount(amount)}</ThemedScreenText>
                    {renderInfo('arrow.forward', 'To', recipient)}
                    {renderInfo('person', 'Name', name)}
                    {renderInfo('network', 'Network fee', '0.0004 SOL')}
                </View>

                <ButtonGroup
                    leftTitle='Cancel'
                    leftVariant='secondary'
                    rightTitle='Confirm'
                    rightVariant='primary'
                    leftOnPress={handleCancel}
                    rightOnPress={handleConfirm}
                />

            </View>
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.xl,
    },
    content: {
        flex: 1,
        gap: Spacing.lg,
    },
    amountText: {
        fontSize: Size.jumbo,
        fontWeight: Weight.boldWeight,
        lineHeight: Size.jumbo * Height.lineHeightNormal,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.sm

    },
    labelText: {
        fontSize: Size.regular,
        fontWeight: Weight.mediumWeight,
        lineHeight: Size.regular * Height.lineHeightMedium,
    },
    infoText: {
        fontSize: Size.mediumLarge,
        fontWeight: Weight.semiBoldWeight,
        lineHeight: Size.mediumLarge * Height.lineHeightMedium,
    },
    label: {
        fontSize: Size.regular,
    }
}); 