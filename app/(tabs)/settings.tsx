import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/ScreenLayout';

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

