import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import tinycolor from 'tinycolor2'; // Import tinycolor

interface CurrencySwitcherProps {
    onCurrencyChange: (currency: string) => void;
    backgroundColor?: string;
    textColor?: string;
}

const CurrencySwitcher = ({ onCurrencyChange, backgroundColor = 'white', textColor = '#000' }: CurrencySwitcherProps) => {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    // Define colors
    const selectedBackgroundColor = backgroundColor;
    // Define unselected background using RGBA for opacity
    // Example: White background at 10% opacity
    const colorInstance = tinycolor(backgroundColor); // Use tinycolor() function
    const unselectedBackgroundColor = colorInstance.setAlpha(0.1).toRgbString();
    const unselectedTextColor = backgroundColor;
    // Example: A dark grey at 50% opacity
    // const unselectedBackgroundColor = 'rgba(50, 50, 50, 0.5)';

    const handleCurrencyChange = (currency: string) => {
        setSelectedCurrency(currency);
        onCurrencyChange(currency);
    }

    // Flag icons
    const usFlagIcon = require('@/assets/images/us-flag-round.png');
    const euFlagIcon = require('@/assets/images/eu-flag-round.png');

    return (
        <View style={styles.wrapper}>
            <BlurView intensity={20} tint="dark" style={[styles.container, { backgroundColor: unselectedBackgroundColor }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        {
                            backgroundColor: selectedCurrency === 'USD'
                                ? selectedBackgroundColor
                                : 'transparent'
                        }
                    ]}
                    onPress={() => handleCurrencyChange('USD')}
                >
                    <View style={styles.tabContent}>
                        <Image source={usFlagIcon} style={styles.flagIcon} />
                        <Text style={[
                            styles.tabText,
                            { color: selectedCurrency === 'USD' ? textColor : unselectedTextColor }
                        ]}>USD</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        {
                            backgroundColor: selectedCurrency === 'EUR'
                                ? selectedBackgroundColor
                                : 'transparent'
                        }
                    ]}
                    onPress={() => handleCurrencyChange('EUR')}
                >
                    <View style={styles.tabContent}>
                        <Image source={euFlagIcon} style={styles.flagIcon} />
                        <Text style={[
                            styles.tabText,
                            { color: selectedCurrency === 'EUR' ? textColor : unselectedTextColor }
                        ]}>EUR</Text>
                    </View>
                </TouchableOpacity>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        borderRadius: 25,
        overflow: 'hidden',
        alignSelf: 'center',
        width: 'auto', // This ensures it only takes the width it needs
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25, // Apply border radius here if needed for selected state background
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    tabText: {
        color: '#8E8E93',
        fontWeight: '500',
    },
    selectedText: {
        color: '#000',
    },
});

export default CurrencySwitcher;