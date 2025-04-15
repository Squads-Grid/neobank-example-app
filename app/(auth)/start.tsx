import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { router } from 'expo-router';
import { Spacing } from '@/constants/Spacing';

export default function StartScreen() {

  return (
    <ScreenLayout >
      <View style={styles.container}>
        <ThemedText style={styles.title} type="title">Bright</ThemedText>
        <ThemedText type="default">Your finances, upgraded</ThemedText>
      </View>
      <View>
        <ThemedButton style={{marginBottom: Spacing.md}} title="Login" onPress={() => router.push('/login')} />
        <ThemedButton variant="secondary" title="Sign up" onPress={() => router.push('/login')} />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginBottom: 0
  }
}); 