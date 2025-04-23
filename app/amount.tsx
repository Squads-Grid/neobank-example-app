import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Keypad } from '@/components/ui/Keypad';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';

export default function AmountScreen() {
    const [amount, setAmount] = useState('0');
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');

    // Get params from the router
    const { type, title } = useLocalSearchParams<{ type: string; title: string }>();

    const handleKeyPress = (key: string) => {
        if (key === 'backspace') {
            // Remove the last character
            setAmount(prev =>
                prev.length > 1 ? prev.slice(0, -1) : '0'
            );
        } else if (key === '.') {
            // Only add decimal if it doesn't exist already
            if (!amount.includes('.')) {
                setAmount(prev => prev + '.');
            }
        } else {
            // Handle number keys
            if (amount === '0') {
                setAmount(key);
            } else {
                // Limit to 2 decimal places
                const parts = amount.split('.');
                if (parts.length > 1 && parts[1].length >= 2) {
                    return;
                }
                setAmount(prev => prev + key);
            }
        }
    };

    const handleContinue = () => {
        // Navigate to the next screen with the amount
        console.log(amount);
        // router.push({
        //     pathname: '/confirm',
        //     params: {
        //         amount,
        //         type,
        //         title
        //     }
        // });
    };

    const formattedAmount = () => {
        try {
            return parseFloat(amount).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: amount.includes('.') ? 2 : 0,
                maximumFractionDigits: 2
            });
        } catch (e) {
            return '$0';
        }
    };

    return (
        <ThemedScreen>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={textColor} />
                </TouchableOpacity>
                <ThemedScreenText type="defaultSemiBold" style={styles.headerTitle}>
                    {title || 'Send'}
                </ThemedScreenText>
            </View>

            <View style={styles.container}>
                <ThemedScreenText type="default" style={styles.label}>Enter amount</ThemedScreenText>

                <Text style={[styles.amountText, { color: textColor }]}>
                    {formattedAmount()}
                </Text>

                <View style={styles.keypadContainer}>
                    <Keypad onKeyPress={handleKeyPress} />
                </View>
                <ThemedScreenButton
                    title="Continue"
                    onPress={handleContinue}
                />
            </View>
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        marginRight: 28, // To balance the back button width
    },
    backButton: {
        padding: Spacing.xs,
    },
    label: {
        fontSize: 16,
        marginTop: 40,
        marginBottom: 8,
        opacity: 0.7,
    },
    amountText: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: Spacing.lg,
    },
    keypadContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    continueButton: {
        width: '100%',
        paddingVertical: Spacing.md,
        borderRadius: 28,
        marginTop: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
}); 