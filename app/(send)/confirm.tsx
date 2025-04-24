import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/Spacing';

export default function ConfirmScreen() {
    const { amount, recipient, note, type, title } = useLocalSearchParams<{
        amount: string;
        recipient: string;
        note: string;
        type: string;
        title: string;
    }>();

    const handleConfirm = () => {
        // Handle confirmation logic
        console.log('Confirmed:', { amount, recipient, note, type, title });

        // Navigate to success screen
        router.push({
            pathname: '/success',
            params: { amount, type, title }
        });
    };

    return (
        <ThemedScreen useSafeArea={true} safeAreaEdges={['bottom', 'left', 'right']}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <ThemedScreenText type="title">Confirm Transaction</ThemedScreenText>

                    <ThemedScreenText type="defaultSemiBold">Amount</ThemedScreenText>


                    <ThemedScreenText type="defaultSemiBold">Recipient</ThemedScreenText>


                    {note && (
                        <>
                            <ThemedScreenText type="defaultSemiBold">Note</ThemedScreenText>

                        </>
                    )}
                </View>

                <ThemedScreenButton
                    title="Confirm"
                    onPress={handleConfirm}
                />
            </View>
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.lg,
    },
}); 