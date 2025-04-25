import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { StarburstBank } from '@/components/ui/StarburstBank';
import { Spacing } from '@/constants/Spacing';
import CurrencySwitcher from '@/components/ui/CurrencySwitcher';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';

function BankDetailsScreen() {
    const [error, setError] = useState<string | null>(null);
    const { backgroundColor, textColor } = useScreenTheme();
    const [selectedCurrency, setSelectedCurrency] = useState('USD');


    return (
        <ThemedScreen>
            <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
            <CurrencySwitcher onCurrencyChange={setSelectedCurrency} backgroundColor={textColor} textColor={backgroundColor} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg * 2 }}>
                <ThemedScreenText type="subtitle" style={{ color: 'white' }}>
                    {selectedCurrency === 'USD' ? 'Virtual US Bank Account' : 'Virtual EU Bank Account'}
                </ThemedScreenText>

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
    },
    headerContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: Spacing.lg * 3,
    },
    actionContainer: {
        flex: 0.1,
        alignItems: 'center',
    },
});
