import React, { useState, useRef } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, TouchableOpacity, Animated, PanResponder } from 'react-native';
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


const usBankDetails = [
    {
        label: 'Bank routing number',
        value: '101019644'
    },
    {
        label: 'Bank account number',
        value: '1234567890'
    },
    {
        label: 'Bank name',
        value: 'Bank of Nowhere'
    },
    {
        label: 'Bank beneficiary name',
        value: 'DENI ERSHTUKAEV'
    },
    {
        label: 'Bank address',
        value: '123 Main St, Anytown, USA'
    },
];

const euBankDetails = [
    {
        label: 'IBAN',
        value: 'DE89 3704 0044 0532 0130 00'
    },
    {
        label: 'BIC/SWIFT',
        value: 'DEUTDEDBXXX'
    },
    {
        label: 'Bank name',
        value: 'Deutsche Bank'
    },
    {
        label: 'Bank beneficiary name',
        value: 'DENI ERSHTUKAEV'
    },
    {
        label: 'Bank address',
        value: 'Unter den Linden 13-15, 10117 Berlin, Germany'
    },
];

interface BankDetail {
    label: string;
    value: string;
    icon?: IconSymbolName;
}


function BankDetailsModal() {
    const params = useGlobalSearchParams();
    const initialCurrency = params.currency as string || 'USD';

    const [error, setError] = useState<string | null>(null);
    const { backgroundColor, textColor } = useScreenTheme();
    const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Get the appropriate bank details based on selected currency
    const bankDetails = selectedCurrency === 'USD' ? usBankDetails : euBankDetails;

    // Animation value for dismissal gesture
    const pan = useRef(new Animated.ValueXY()).current;

    // Create the pan responder
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // Only respond to vertical gestures from the top area
                return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
            },
            onPanResponderMove: (evt, gestureState) => {
                // Follow the gesture
                if (gestureState.dy > 0) { // Only allow downward movement
                    pan.y.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // If swiped down with enough velocity or distance, dismiss
                if (gestureState.dy > 100 || (gestureState.vy > 0.5 && gestureState.dy > 50)) {
                    handleClose();
                } else {
                    // Otherwise bounce back
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

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
        try {
            // Create a formatted string of all bank details
            const allDetails = bankDetails.map(detail => `${detail.label}: ${detail.value}`).join('\n');

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

    // Handle close modal
    const handleClose = () => {
        router.back();
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
                        <ThemedScreenText type="regular" style={{ color: textColor + 40 }}>
                            Fees{' '}
                        </ThemedScreenText>
                        <ThemedScreenText type="regular">
                            0.1%
                        </ThemedScreenText>
                    </>
                )}
                {renderChipContent(
                    <>
                        <ThemedScreenText type="regular">
                            Limits{' '}
                        </ThemedScreenText>
                        <IconSymbol name="arrow.up.right" size={10} color={textColor} />
                    </>
                )}
                {renderChipContent(
                    <ThemedScreenText type="regular" style={{ color: textColor + 40 }}>
                        Min. transfer is {selectedCurrency === 'USD' ? '$2' : '€2'}
                    </ThemedScreenText>

                )}
            </View>
        );
    }

    const renderInfo = (detail: BankDetail) => {
        const isCopied = copiedField === detail.label;

        return (
            <View key={detail.label} style={styles.infoContainer}>
                <ThemedScreenText type="regular" style={{ color: textColor + 40 }}>{detail.label}</ThemedScreenText>
                <View style={styles.infoValueContainer}>
                    <ThemedScreenText
                        type="regular"
                        style={styles.infoValue}
                        numberOfLines={0}
                    >
                        {detail.value}
                    </ThemedScreenText>
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

    return (
        <Animated.View
            style={{
                ...styles.modalContainer,
                transform: [{ translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
        >
            <ThemedScreen>
                {/* Add a visual indicator for the modal pull-down behavior */}
                <View style={styles.pullIndicator} />

                <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
                <CurrencySwitcher onCurrencyChange={setSelectedCurrency} backgroundColor={textColor} textColor={backgroundColor} />
                <View style={styles.contentContainer}>
                    <ThemedScreenText type="subtitle">
                        {selectedCurrency === 'USD' ? 'Virtual US Bank Account' : 'Virtual EU Bank Account'}
                    </ThemedScreenText>
                    <ThemedScreenText type="regular" style={[styles.subtitle, { color: textColor + 40 }]} >
                        Accept {selectedCurrency === 'USD' ? 'ACH & Wire' : 'SEPA'} Payments
                    </ThemedScreenText>
                    {renderChips()}
                    <DashedDivider color={textColor + 10} thickness={1} />
                    {bankDetails.map((detail) => renderInfo(detail))}
                </View>
                <ThemedScreenText type="tiny" style={[styles.footerText, { color: textColor + 40 }]}>
                    For assistance regarding issues with transfers and deposits, reach out to <Link href="mailto:support@bridge.xyz">support@bridge.xyz</Link>
                </ThemedScreenText>
                <ThemedScreenButton
                    onPress={handleCopyAll}
                    title={copiedField === 'all' ? 'Copied!' : 'Copy all details'}
                    variant={copiedField === 'all' ? 'outline' : 'primary'}
                />
            </ThemedScreen>
        </Animated.View>
    );
}

export default withScreenTheme(BankDetailsModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    pullIndicator: {
        width: 40,
        height: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: Spacing.md, // Reduced top margin to account for pull indicator
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
        marginTop: Spacing.md,
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