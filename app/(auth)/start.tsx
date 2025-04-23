import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { ScreenHeaderText } from '@/components/ui/ScreenHeaderText';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen } from '@/components/ui/ThemedScreen';

const starburstImage = require('@/assets/images/starburst.png');

export function StartScreen() {

    return (
        <ThemedScreen style={{ justifyContent: 'space-between' }}>
            {/* Background Image */}
            <Image
                source={starburstImage}
                style={styles.backgroundImage}
                resizeMode="contain"
            />
            <ScreenHeaderText title="Bright" subtitle="Your finances, upgraded" />
            <View>
                <View style={styles.buttonContainer}>
                    <ThemedScreenButton
                        title="Login"
                        onPress={() => router.push('/(auth)/login')}
                        variant="primary"
                        style={styles.button}
                    />
                    <ThemedScreenButton
                        title="Sign up"
                        onPress={() => router.push('/(auth)/login')}
                        variant="secondary"
                        style={styles.button}
                    />
                </View>
            </View>
        </ThemedScreen>
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
    buttonContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        alignItems: 'stretch',
    },
    button: {
        flex: 1,
    },
});
