import { ThemedText } from '@/components/ui/atoms';
import { ThemedButton } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/layout';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SettingsScreen() {
    const { logout } = useAuth();
    const textColor = useThemeColor({}, 'text');

    return (
        <ScreenLayout>
            <View style={styles.header}>
                <ThemedText type="highlight">Settings</ThemedText>
            </View>
            <View style={styles.footer}>
                <ThemedButton
                    title="Logout"
                    onPress={logout}
                    variant="outline"
                    textStyle={{ color: textColor }}
                />
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: Spacing.xxl,
    },
    subtitle: {
        marginTop: Spacing.xs,
        opacity: 0.7,
    },
    section: {
        marginBottom: Spacing.xl,
        width: '100%',
    },
    sectionTitle: {
        marginBottom: Spacing.md,
        color: '#FF6B6B',
    },
    devModeContainer: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 8,
        padding: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    devModeText: {
        opacity: 0.8,
    },
    footer: {
        marginTop: 'auto',
        width: '100%',
        paddingBottom: Spacing.xxxl,
    },
});

