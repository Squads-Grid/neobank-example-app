import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { HeaderText } from '@/components/ui/HeaderText';

const FIXED_BACKGROUND_COLOR = '#000';

export default function StartScreen() {

    return (
        <ScreenLayout style={{ justifyContent: 'space-between' }} lightColor={FIXED_BACKGROUND_COLOR} darkColor={FIXED_BACKGROUND_COLOR}>
            <HeaderText title="Bright" subtitle="Your finances, upgraded" />
            <View>
                <View style={styles.buttonContainer}>
                    <ThemedButton
                        title="Login"
                        onPress={() => router.push('/login')}
                        variant="onColorPrimary"
                        style={styles.button}
                    />
                    <ThemedButton
                        title="Sign up"
                        onPress={() => router.push('/login')}
                        variant="onColorSecondary"
                        style={styles.button}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        alignItems: 'stretch',
    },
    button: {
        flex: 1,
    },
});
