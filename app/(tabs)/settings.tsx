import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/ScreenLayout';

export default function SettingsScreen() {
    const { logout } = useAuth();

    return (
        <ScreenLayout>
            <ThemedScreenText type="title">Settings</ThemedScreenText>
            <ThemedScreenButton
                title="Logout"
                onPress={logout}
                variant="outline"
            />
        </ScreenLayout>
    );
}

