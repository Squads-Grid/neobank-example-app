import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { CurrencySwitcher, SwipeableModal } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText, Chip, IconSymbol, Divider } from '@/components/ui/atoms';
import { IconSymbolName } from '@/components/ui/atoms/IconSymbol';
import { Link } from 'expo-router';
import { ThemedButton } from '@/components/ui/molecules';
import * as Haptics from 'expo-haptics';

interface BankDetail {
    label: string;
    value: string;
    icon?: IconSymbolName;
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

    // Handle close modal
    const handleClose = () => {
        router.back();
    };

    // Handle copying a single field
    const handleCopy = async (label: string, value: string) => {
        try {
            await Clipboard.setStringAsync(value);
            setCopiedField(label);

            // Provide haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Reset the copied indicator after 2 seconds
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

            // Provide haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Reset the copied indicator after 2 seconds
            setTimeout(() => {
                setCopiedField(null);
            }, 2000);
        } catch (e) {
            setError('Failed to copy to clipboard');
        }
    };

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
        console.log("🚀 ~ renderInfo ~ detail:", detail)
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

    if (!bankAccountDetails?.[0]) {
        return (
            <ThemedScreen>
                <View>
                    <ThemedText>No bank details found</ThemedText>
                </View>
            </ThemedScreen>
        );
    }


    const bankDetails: BankDetail[] = [
        { label: 'Bank Name', value: bankAccountDetails[0].source_deposit_instructions.bank_name },
        { label: 'Account Number', value: bankAccountDetails[0].source_deposit_instructions.bank_account_number },
        { label: 'Beneficiary Name', value: bankAccountDetails[0].source_deposit_instructions.bank_beneficiary_name },
        { label: 'Bank Address', value: bankAccountDetails[0].source_deposit_instructions.bank_address },
    ];

    return (
        <ThemedScreen>
            <SwipeableModal onDismiss={handleClose}>
                <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
                <View style={{ height: Spacing.md }} />
                <CurrencySwitcher onCurrencyChange={setSelectedCurrency} backgroundColor={textColor} textColor={backgroundColor} />
                <View style={styles.contentContainer}>
                    <ThemedText type="subtitle">
                        {selectedCurrency === 'usd' ? 'Virtual US Bank Account' : 'Virtual EU Bank Account'}
                    </ThemedText>
                    <ThemedText type="regular" style={[styles.subtitle, { color: textColor + 40 }]} >
                        Accept {selectedCurrency === 'usd' ? 'ACH & Wire' : 'SEPA'} Payments
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
            </SwipeableModal>
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: Spacing.xl,
        marginHorizontal: Spacing.md
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
        paddingBottom: Spacing.sm
    },
    infoValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: Spacing.xxs
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

export default withScreenTheme(BankDetailsModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
}); 