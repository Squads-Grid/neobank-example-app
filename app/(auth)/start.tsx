import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { HeaderText } from '@/components/ui/HeaderText';

// Assuming the image is here
const starburstImage = require('@/assets/images/starburst.png');

const FIXED_BACKGROUND_COLOR = '#000';

export default function StartScreen() {

    return (
        <ScreenLayout style={{ justifyContent: 'space-between' }} lightColor={FIXED_BACKGROUND_COLOR} darkColor={FIXED_BACKGROUND_COLOR}>
            {/* Background Image */}
            <Image
                source={starburstImage}
                style={styles.backgroundImage}
                resizeMode="contain"
            />

            {/* Existing Content - ensure it renders "on top" */}
            {/* Header Text - Positioned by ScreenLayout's default padding or specific styles */}
            <HeaderText title="Bright" subtitle="Your finances, upgraded" />

            {/* Buttons container */}
            <View style={styles.buttonsOuterContainer}>
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
    backgroundImage: {
        position: 'absolute',
        left: '-18%',
        top: '-25%',
        width: '150%',
        height: '150%',
    },
    buttonsOuterContainer: {
        // This View helps ensure buttons are grouped and layout works with justifyContent: 'space-between'
        // It doesn't need specific styles unless for extra margin/padding at the bottom
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        alignItems: 'stretch',
        // Add paddingHorizontal if buttons shouldn't touch edges, though ScreenLayout might handle this
        // paddingHorizontal: Spacing.lg,
    },
    button: {
        flex: 1,
    },
});
