import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { ScreenHeaderText, ButtonGroup, ThemedButton } from '@/components/ui/molecules';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, Starburst } from '@/components/ui/layout';

export function StartScreen() {

    return (
        <ThemedScreen style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Background Starburst */}
            <Starburst />
            <ScreenHeaderText title="Bright" subtitle="Your finances, upgraded" />
            {/* <View > */}
            <ThemedButton
                title="Start now"
                onPress={() => router.push('/(auth)/login')}
                style={{ width: 200 }}
            />
            {/* <ButtonGroup
                    leftTitle="Login"
                    leftOnPress={() => router.push('/(auth)/login')}
                    rightTitle="Sign up"
                    rightOnPress={() => router.push('/(auth)/signup')}
                /> */}
            {/* </View> */}
        </ThemedScreen>
    );
}

export default withScreenTheme(StartScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

