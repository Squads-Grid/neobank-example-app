import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { StarburstBank } from '@/components/ui/StarburstBank';
import { Spacing } from '@/constants/Spacing';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { Chip } from '@/components/ui/Chip';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { DashedDivider } from '@/components/ui/DashedDivider';


function BankDetailsScreen() {
    const [error, setError] = useState<string | null>(null);
    const { backgroundColor, textColor } = useScreenTheme();
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const renderChipContent = (content: React.ReactNode) => {
        return (
            <Chip>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {content}
                </View>
            </Chip>
        )
    }

    return (
        <ThemedScreen>
            <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
            <CurrencySwitcher onCurrencyChange={setSelectedCurrency} backgroundColor={textColor} textColor={backgroundColor} />
            <View style={styles.contentContainer}>
                <ThemedScreenText type="subtitle">
                    {selectedCurrency === 'USD' ? 'Virtual US Bank Account' : 'Virtual EU Bank Account'}
                </ThemedScreenText>
                <ThemedScreenText type="regular" style={[styles.subtitle, { color: textColor + 40 }]} >
                    Accept ACH & Wire Payments
                </ThemedScreenText>
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
                <DashedDivider color={textColor + 10} thickness={1} />
            </View>
        </ThemedScreen>
    );
}

export default withScreenTheme(BankDetailsScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        zIndex: 1,
        alignItems: 'center',
        marginTop: Spacing.lg * 2
    },
    subtitle: {
        marginTop: Spacing.sm
    },
    chipsContainer: {
        flexDirection: 'row',
        gap: Spacing.xs,
        marginTop: Spacing.md
    }
});
