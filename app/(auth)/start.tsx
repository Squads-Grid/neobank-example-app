import React from 'react';
import { router } from 'expo-router';
import { ScreenHeaderText, ThemedButton } from '@/components/ui/molecules';
import { WithScreenTheme } from '@/components/WithScreenTheme';
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
                onPress={() => router.push('/(auth)/create-account')}
                style={{ width: 200 }}
            />
        </ThemedScreen>
    );
}

export default WithScreenTheme(StartScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

