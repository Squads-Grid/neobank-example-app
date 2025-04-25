import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router, useGlobalSearchParams } from 'expo-router';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { StarburstBank } from '@/components/ui/StarburstBank';
import { Spacing } from '@/constants/Spacing';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { Chip } from '@/components/ui/Chip';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { DashedDivider } from '@/components/ui/DashedDivider';
import { Link } from 'expo-router';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import * as Haptics from 'expo-haptics';
import { SwipeableModal } from '@/components/ui/SwipeableModal';

const INFO = [
    {
        icon: 'dollarsign.arrow.circlepath',
        textEUR: 'Get paid in EUR and automatically receive EURC in your Fuse wallet',
        textUSD: 'Get paid in USD and automatically receive USDC in your Fuse wallet'
    },
    {
        icon: 'arrow.down.circle',
        textEUR: 'Receive payments from anyone with a bank account for a 0.1% conversion fee',
        textUSD: 'Receive payments from anyone with a bank account for a 0.1% conversion fee'
    },
    {
        icon: 'checkmark.circle',
        textEUR: 'Quick setup through Bridge with standard KYC verification',
        textUSD: 'Quick setup through Bridge with standard KYC verification'
    },
];

interface InfoItem {
    icon: string;
    textEUR: string;
    textUSD: string;
}

function BankDetailsModal() {
    const params = useGlobalSearchParams();
    const initialCurrency = params.currency as string || 'USD';

    const [error, setError] = useState<string | null>(null);
    const { backgroundColor, textColor } = useScreenTheme();
    const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

    // Handle close modal
    const handleClose = () => {
        router.back();
    };


    const renderInfo = (detail: InfoItem) => {
        return (
            <View key={detail.icon} style={styles.infoContainer}>
                <View style={styles.infoValueContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: textColor + 40 }]}>
                        <IconSymbol
                            name={detail.icon as IconSymbolName}
                            size={20}
                            color={textColor}
                        />
                    </View>
                    <ThemedScreenText
                        type="regular"
                        style={[styles.infoValue, { color: textColor + 40 }]}
                        numberOfLines={0}
                    >
                        {selectedCurrency === 'EUR' ? detail.textEUR : detail.textUSD}
                    </ThemedScreenText>
                </View>
            </View>
        )
    }

    return (

        <ThemedScreen>
            <SwipeableModal onDismiss={handleClose}>
                <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
                <View style={{ height: Spacing.md }} />
                <CurrencySwitcher onCurrencyChange={setSelectedCurrency} backgroundColor={textColor} textColor={backgroundColor} />
                <View style={styles.contentContainer}>
                    <ThemedScreenText type="subtitle">
                        {selectedCurrency === 'USD' ? 'Create Virtual US Bank Account' : 'Create Virtual EU Bank Account'}
                    </ThemedScreenText>
                    <View style={styles.infoWrapper}>
                        {INFO.map((detail) => renderInfo(detail))}
                    </View>
                </View>
                <ThemedScreenButton
                    onPress={() => { }}
                    title={selectedCurrency === 'USD' ? 'Create Virtual US Account' : 'Create Virtual EU Account'}
                />
            </SwipeableModal>
        </ThemedScreen>

    );
}

export default withScreenTheme(BankDetailsModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginHorizontal: Spacing.md
    },
    iconContainer: {
        padding: 7,
        borderRadius: 10
    },
    infoWrapper: {
        width: '100%',
        marginTop: Spacing.xl
    },
    subtitle: {
        marginTop: Spacing.sm
    },
    chipsContainer: {
        flexDirection: 'row',
        gap: Spacing.xs,
        marginTop: Spacing.md
    },
    infoContainer: {
        width: '100%',
        marginBottom: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    infoValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: Spacing.xxs,
        gap: Spacing.md
    },
    infoValue: {
        flex: 1,
        marginRight: Spacing.md,
        flexWrap: 'wrap'
    },
    copyButton: {
        padding: Spacing.xxs,  // Add some padding for a larger touch target
    },
    footerText: {
        width: '80%',
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: Spacing.xl
    }
}); 