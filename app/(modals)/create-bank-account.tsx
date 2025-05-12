import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { CurrencySwitcher, SwipeableModal } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText, IconSymbol, Divider } from '@/components/ui/atoms';
import { IconSymbolName } from '@/components/ui/atoms/IconSymbol';
import { ThemedButton } from '@/components/ui/molecules';
import { OverlappingImages } from '@/components/ui/organisms';

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

function CreateBankAccountModal() {
    const params = useGlobalSearchParams();
    const initialCurrency = params.currency as string || 'USD';

    const { setSelectedCurrency } = useModalFlow();
    const [error, setError] = useState<string | null>(null);
    const { backgroundColor, textColor } = useScreenTheme();
    const [selectedCurrency, setSelectedCurrencyState] = useState(initialCurrency);

    // Handle close modal
    const handleClose = () => {
        router.back();
    };

    const handleCurrencyChange = (currency: 'USD' | 'EUR') => {
        setSelectedCurrencyState(currency);
        setSelectedCurrency(currency);
    };

    const renderInfo = (detail: InfoItem, isLast: boolean) => {
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
                    <View style={{ flex: 1 }}>
                        <ThemedText
                            type="regular"
                            style={[styles.infoValue, { color: textColor + 40 }]}
                            numberOfLines={0}
                        >
                            {selectedCurrency === 'EUR' ? detail.textEUR : detail.textUSD}
                        </ThemedText>
                        {!isLast && <Divider type="solid" color={textColor + 10} thickness={1} />}
                    </View>
                </View>
            </View>
        )
    }

    return (
        <ThemedScreen>
            <SwipeableModal onDismiss={handleClose}>
                <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
                <View style={{ height: Spacing.md }} />
                <CurrencySwitcher onCurrencyChange={handleCurrencyChange} backgroundColor={textColor} textColor={backgroundColor} />
                <View style={styles.flagContainer}>
                    <OverlappingImages
                        leftImage={require('@/assets/images/us-flag-round.png')}
                        rightImage={require('@/assets/images/eu-flag-round.png')}
                        size={64}
                        overlap={0.3}
                        borderWidth={0}
                        leftOnTop={selectedCurrency === 'USD'}
                        backdropOpacity={0.4}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <ThemedText type="large" style={styles.headline}>
                        Create your
                    </ThemedText>
                    <ThemedText type="large" style={styles.headline}>
                        {selectedCurrency === 'USD' ? 'Virtual US Bank Account' : 'Virtual EU Bank Account'}
                    </ThemedText>
                    <View style={styles.infoWrapper}>
                        {INFO.map((detail, index) => renderInfo(detail, index === INFO.length - 1))}
                    </View>
                </View>
                <ThemedButton
                    onPress={() => { }}
                    title={selectedCurrency === 'USD' ? 'Create Virtual US Account' : 'Create Virtual EU Account'}
                />
            </SwipeableModal>
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    flagContainer: {
        alignItems: 'center',
        marginTop: Spacing.xxl
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginHorizontal: Spacing.md
    },
    headline: {
        textAlign: 'center',
    },
    iconContainer: {
        padding: 7,
        borderRadius: 10
    },
    infoWrapper: {
        width: '100%',
        marginTop: Spacing.xxl
    },
    infoContainer: {
        width: '100%',
    },
    infoValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: Spacing.md
    },
    infoValue: {
        marginBottom: Spacing.xxs,
        paddingRight: Spacing.md
    },
});

export default withScreenTheme(CreateBankAccountModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
}); 