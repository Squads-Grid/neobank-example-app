import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { CurrencySwitcher, SwipeableModal, OverlappingImages, ComingSoonToast } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText, Chip, IconSymbol, Divider } from '@/components/ui/atoms';
import { IconSymbolName } from '@/components/ui/atoms/IconSymbol';
import { Link } from 'expo-router';
import { ThemedButton } from '@/components/ui/molecules';
import * as Haptics from 'expo-haptics';
import { easClient } from '@/utils/easClient';
import { useAuth } from '@/contexts/AuthContext';
import { OpenVirtualAccountParams } from '@/types/VirtualAccounts';

interface BankDetail {
    label: string;
    value: string;
    icon?: IconSymbolName;
}

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
    const {
        selectedCurrency,
        setSelectedCurrency,
        bankAccountDetails,
        isLoading,
        error: contextError
    } = useModalFlow();

    const [error, setError] = useState<string | null>(contextError);
    const { backgroundColor, textColor } = useScreenTheme();
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const { accountInfo, logout } = useAuth();
    const [showToast, setShowToast] = useState(false);

    // Handle close modal
    const handleClose = () => {
        router.back();
    };

    // Handle copying a single field
    const handleCopy = async (label: string, value: string) => {
        try {
            await Clipboard.setStringAsync(value);
            setCopiedField(label);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        } catch (e) {
            setError('Failed to copy to clipboard');
        }
    };

    // Handle copying all fields
    const handleCopyAll = async () => {
        if (!bankAccountDetails) return;

        try {
            const details: BankDetail[] = [
                { label: 'Bank Name', value: bankAccountDetails[0].source_deposit_instructions.bank_name },
                { label: 'Account Number', value: bankAccountDetails[0].source_deposit_instructions.bank_account_number },
                { label: 'Beneficiary Name', value: bankAccountDetails[0].source_deposit_instructions.bank_beneficiary_name },
                { label: 'Bank Address', value: bankAccountDetails[0].source_deposit_instructions.bank_address },
            ];

            const allDetails = details.map(detail => `${detail.label}: ${detail.value}`).join('\n');
            await Clipboard.setStringAsync(allDetails);
            setCopiedField('all');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        } catch (e) {
            setError('Failed to copy to clipboard');
        }
    };

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

    const renderChipContent = (content: React.ReactNode) => {
        return (
            <Chip>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {content}
                </View>
            </Chip>
        )
    }

    const renderChips = () => {
        return (
            <View style={styles.chipsContainer}>
                {renderChipContent(
                    <>
                        <ThemedText type="regular" style={{ color: textColor + 40 }}>
                            Fees{' '}
                        </ThemedText>
                        <ThemedText type="regular">
                            0.1%
                        </ThemedText>
                    </>
                )}
                {renderChipContent(
                    <>
                        <ThemedText type="regular">
                            Limits{' '}
                        </ThemedText>
                        <IconSymbol name="arrow.up.right" size={10} color={textColor} />
                    </>
                )}
                {renderChipContent(
                    <ThemedText type="regular" style={{ color: textColor + 40 }}>
                        Min. transfer is {selectedCurrency === 'usd' ? '$2' : '€2'}
                    </ThemedText>
                )}
            </View>
        );
    }

    const renderInfo = (detail: BankDetail) => {
        const isCopied = copiedField === detail.label;

        return (
            <View key={detail.label} style={styles.infoContainer}>
                <ThemedText type="regular" style={{ color: textColor + 40 }}>{detail.label}</ThemedText>
                <View style={styles.infoValueContainer}>
                    <ThemedText
                        type="regular"
                        style={[styles.infoValue, { color: textColor }]}
                        numberOfLines={0}
                    >
                        {detail.value}
                    </ThemedText>
                    <TouchableOpacity
                        onPress={() => handleCopy(detail.label, detail.value)}
                        style={styles.copyButton}
                    >
                        <IconSymbol
                            name={isCopied ? 'checkmark' : 'doc.on.doc'}
                            size={20}
                            color={textColor + 40}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderCreateAccountInfo = (detail: InfoItem, isLast: boolean) => {

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

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                </View>
            );
        }

        if (bankAccountDetails?.length === 1 && selectedCurrency === 'usd' && bankAccountDetails[0].source_deposit_instructions.currency === 'usd') {
            const bankDetails: BankDetail[] = [
                { label: 'Bank Name', value: bankAccountDetails[0].source_deposit_instructions.bank_name },
                { label: 'Account Number', value: bankAccountDetails[0].source_deposit_instructions.bank_account_number },
                { label: 'Beneficiary Name', value: bankAccountDetails[0].source_deposit_instructions.bank_beneficiary_name },
                { label: 'Bank Address', value: bankAccountDetails[0].source_deposit_instructions.bank_address },
            ];

            return (
                <>
                    <View style={styles.contentContainer}>
                        <ThemedText type="subtitle">
                            Virtual US Bank Account
                        </ThemedText>
                        <ThemedText type="regular" style={{ color: textColor + 40 }} >
                            Accept ACH & Wire Payments
                        </ThemedText>
                        {renderChips()}
                        <Divider type="dashed" color={textColor + 10} thickness={1} />
                        {bankDetails.map((detail) => renderInfo(detail))}
                    </View>
                    <ThemedText type="tiny" style={[styles.footerText, { color: textColor + 40 }]}>
                        For assistance regarding issues with transfers and deposits, reach out to <Link href="mailto:support@bridge.xyz">support@bridge.xyz</Link>
                    </ThemedText>
                    <ThemedButton
                        onPress={handleCopyAll}
                        title={copiedField === 'all' ? 'Copied!' : 'Copy all details'}
                        variant={copiedField === 'all' ? 'outline' : 'primary'}
                    />
                </>
            );
        } else if (bankAccountDetails?.length === 1 && selectedCurrency === 'eur' && bankAccountDetails[0].source_deposit_instructions.currency === 'eur') {
            const bankDetails: BankDetail[] = [
                { label: 'Bank Name', value: bankAccountDetails[0].source_deposit_instructions.bank_name },
                { label: 'Account Number', value: bankAccountDetails[0].source_deposit_instructions.bank_account_number },
                { label: 'Beneficiary Name', value: bankAccountDetails[0].source_deposit_instructions.bank_beneficiary_name },
                { label: 'Bank Address', value: bankAccountDetails[0].source_deposit_instructions.bank_address },
            ];

            return (
                <>
                    <View style={styles.contentContainer}>
                        <ThemedText type="subtitle">
                            Virtual EUR Bank Account
                        </ThemedText>
                        <ThemedText type="regular" style={{ color: textColor + 40 }} >
                            Accept ACH & Wire Payments
                        </ThemedText>
                        {renderChips()}
                        <Divider type="dashed" color={textColor + 10} thickness={1} />
                        {bankDetails.map((detail) => renderInfo(detail))}
                    </View>
                    <ThemedText type="tiny" style={[styles.footerText, { color: textColor + 40 }]}>
                        For assistance regarding issues with transfers and deposits, reach out to <Link href="mailto:support@bridge.xyz">support@bridge.xyz</Link>
                    </ThemedText>
                    <ThemedButton
                        onPress={handleCopyAll}
                        title={copiedField === 'all' ? 'Copied!' : 'Copy all details'}
                        variant={copiedField === 'all' ? 'outline' : 'primary'}
                    />
                </>
            );
        } else {
            return (
                <>
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
                            Virtual {selectedCurrency === 'usd' ? 'US' : 'EUR'} Bank Account
                        </ThemedText>
                        <View style={styles.infoWrapper}>
                            {INFO.map((detail, index) => renderCreateAccountInfo(detail, index === INFO.length - 1))}
                        </View>
                    </View>
                    <ThemedButton
                        onPress={handleCreateBankAccount}
                        title={`Create Virtual ${selectedCurrency === 'usd' ? 'US' : 'EUR'} Account`}
                    />
                </>
            );
        }
    };

    return (
        <ThemedScreen>
            <SwipeableModal onDismiss={handleClose}>
                <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
                <View style={{ height: Spacing.md }} />
                <CurrencySwitcher onCurrencyChange={setSelectedCurrency} backgroundColor={textColor} textColor={backgroundColor} />
                {renderContent()}
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    chipsContainer: {
        flexDirection: 'row',
        gap: Spacing.xs,
        marginTop: Spacing.md
    },
    infoContainer: {
        width: '100%',
    },
    infoValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: Spacing.md
    },
    infoValue: {
        marginBottom: Spacing.xxs,
        paddingHorizontal: Spacing.md
    },
    copyButton: {
        padding: Spacing.xxs,
    },
    footerText: {
        width: '80%',
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: Spacing.xl
    },
});

export default withScreenTheme(BankDetailsModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
}); 