import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { CurrencySwitcher, SwipeableModal, ComingSoonToast } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText, IconSymbol, Divider } from '@/components/ui/atoms';
import { IconSymbolName } from '@/components/ui/atoms/IconSymbol';
import { ThemedButton } from '@/components/ui/molecules';
import { OverlappingImages } from '@/components/ui/organisms';
import { easClient } from '@/utils/easClient';
import { OpenVirtualAccountParams } from '@/types/VirtualAccounts';
import { useAuth } from '@/contexts/AuthContext';
import { Currency } from '@/types/Transaction';

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
    const initialCurrency = params.currency as Currency || 'usd';

    const { setSelectedCurrency } = useModalFlow();
    const [error, setError] = useState<string | null>(null);
    const { backgroundColor, textColor } = useScreenTheme();
    const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(initialCurrency);
    const { accountInfo, logout } = useAuth();
    const [showToast, setShowToast] = useState(false);

    // Handle close modal
    const handleClose = () => {
        router.back();
    };

    const handleCurrencyChange = (currency: Currency) => {
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
                            {selectedCurrency === 'eur' ? detail.textEUR : detail.textUSD}
                        </ThemedText>
                        {!isLast && <Divider type="solid" color={textColor + 10} thickness={1} />}
                    </View>
                </View>
            </View>
        )
    }

    const handleCreateBankAccount = async () => {
        if (selectedCurrency === 'eur') {
            setShowToast(true);
            return;
        }

        if (!accountInfo) {
            logout();
            return;
        }
        const accountParams: OpenVirtualAccountParams = {
            smartAccountAddress: accountInfo.smart_account_address,
            gridUserId: accountInfo.grid_user_id,
            currency: selectedCurrency
        }
        const response = await easClient.openVirtualAccount(accountParams);
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
                        leftOnTop={selectedCurrency === 'usd'}
                        backdropOpacity={0.4}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <ThemedText type="large" style={styles.headline}>
                        Create your
                    </ThemedText>
                    <ThemedText type="large" style={styles.headline}>
                        {selectedCurrency === 'usd' ? 'Virtual US Bank Account' : 'Virtual EU Bank Account'}
                    </ThemedText>
                    <View style={styles.infoWrapper}>
                        {INFO.map((detail, index) => renderInfo(detail, index === INFO.length - 1))}
                    </View>
                </View>
                <ThemedButton
                    onPress={handleCreateBankAccount}
                    title={selectedCurrency === 'usd' ? 'Create Virtual US Account' : 'Create Virtual EU Account'}
                />
            </SwipeableModal>
            <ComingSoonToast
                visible={showToast}
                message="EUR accounts coming soon to your region!"
                onHide={() => setShowToast(false)}
            />
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