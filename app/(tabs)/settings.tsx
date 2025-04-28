import { ThemedScreenText } from '@/components/ui/atoms';
import { ThemedScreenButton } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/layout';
import { StageSelector, Stage } from '@/components/settings/StageSelector';
import { useStage } from '@/contexts/StageContext';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/Spacing';

export default function SettingsScreen() {
    const { logout } = useAuth();
    const { stage, setStage } = useStage();

    const handleStageChange = (newStage: Stage) => {
        setStage(newStage);

        // Developer/Demo feature: Changing account stage for testing purposes
        console.log(`[DEMO MODE] Account stage changed to: ${newStage}`);
    };

    return (
        <ScreenLayout>
            <View style={styles.header}>
                <ThemedScreenText type="highlight">Settings</ThemedScreenText>
                <ThemedScreenText type="regular" style={styles.subtitle}>
                    Customize your app settings and development options
                </ThemedScreenText>
            </View>

            <View style={styles.section}>
                <ThemedScreenText type="defaultSemiBold" style={styles.sectionTitle}>
                    Developer Options
                </ThemedScreenText>
                <View style={styles.devModeContainer}>
                    <ThemedScreenText type="tiny" style={styles.devModeText}>
                        These settings affect demo flow only and would not be present in production
                    </ThemedScreenText>
                </View>
                <StageSelector onStageChange={handleStageChange} initialStage={stage} />
            </View>

            <View style={styles.footer}>
                <ThemedScreenButton
                    title="Logout"
                    onPress={logout}
                    variant="outline"
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

