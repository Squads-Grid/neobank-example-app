import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { ScreenHeaderText } from '@/components/ui/ScreenHeaderText';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { ButtonGroup } from '../../components/ui/ButtonGroup';
import { Starburst } from '@/components/ui/Starburst';

export function StartScreen() {

    return (
        <ThemedScreen style={{ justifyContent: 'space-between' }}>
            {/* Background Starburst */}
            <Starburst />
            <ScreenHeaderText title="Bright" subtitle="Your finances, upgraded" />
            <View>
                <ButtonGroup
                    leftTitle="Login"
                    leftOnPress={() => router.push('/(auth)/login')}
                    rightTitle="Sign up"
                    rightOnPress={() => router.push('/(auth)/login')}
                />
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
    container: {
        flex: 1,
    },
    starburst: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        opacity: 0.1,
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
