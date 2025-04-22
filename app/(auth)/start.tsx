import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { ScreenHeaderText } from '@/components/ui/ScreenHeaderText';
import { withScreenTheme } from '@/components/withScreenTheme';
// Assuming the image is here
const starburstImage = require('@/assets/images/starburst.png');

const FIXED_BACKGROUND_COLOR = '#000';

export function StartScreen() {

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
            <ScreenHeaderText title="Bright" subtitle="Your finances, upgraded" />

            {/* Buttons container */}
            <View style={styles.buttonsOuterContainer}>
                <View style={styles.buttonContainer}>
                    <ThemedScreenButton
                        title="Login"
                        onPress={() => router.push('/login')}
                        variant="primary"
                        style={styles.button}
                    />
                    <ThemedScreenButton
                        title="Sign up"
                        onPress={() => router.push('/login')}
                        variant="secondary"
                        style={styles.button}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
}

export default withScreenTheme(StartScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

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
