import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Spacing } from '@/constants/Spacing';

export default function SettingsScreen() {
  const { logout } = useAuth();

  return (
    <ScreenLayout>
      <ThemedText type="title">Settings</ThemedText>
      <ThemedButton
        title="Logout"
        onPress={logout}
        variant="outline"
      />
    </ScreenLayout>
  );
}

