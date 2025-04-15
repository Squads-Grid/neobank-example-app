import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Spacing } from '@/constants/Spacing';

interface HeaderTextProps {
  title: string;
  subtitle?: string;
  flex?: number;
}

export function HeaderText({ title, subtitle, flex }: HeaderTextProps) {
  return (
    <View style={[styles.container, flex ? { flex } : {}]}>
      <ThemedText style={styles.title} type="title">{title}</ThemedText>
      {subtitle && <ThemedText type="default">{subtitle}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
}); 