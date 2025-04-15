import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { ThemedView } from './ThemedView';
import { Spacing } from '@/constants/Spacing';

interface ScreenLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenLayout({ children, style }: ScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={[styles.container, style]}>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
}); 