import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { HeaderText } from '@/components/ui/HeaderText';

export default function StartScreen() {

  return (
    <ScreenLayout style={{justifyContent: 'space-between'}}>
      <HeaderText title="Bright" subtitle="Your finances, upgraded" />
      <View>
        <ThemedButton style={{marginBottom: Spacing.md}} title="Login" onPress={() => router.push('/login')} />
        <ThemedButton variant="secondary" title="Sign up" onPress={() => router.push('/login')} />
      </View>
    </ScreenLayout>
  );
}
