import { ThemedText } from '@/components/ui/atoms';
import { ThemedButton } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/layout';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import * as SecureStore from 'expo-secure-store';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function SettingsScreen() {
    const { logout, email } = useAuth();
    const { kycStatus } = useModalFlow();
    const textColor = useThemeColor({}, 'text');
    const [gridUserId, setGridUserId] = useState<string>('');

    useEffect(() => {
        const loadGridUserId = async () => {
            const id = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID);
            if (id) setGridUserId(id);
        };
        loadGridUserId();
    }, []);

    const formatKycStatus = (status: string | null) => {
        if (!status) return 'Not Started';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatGridUserId = (id: string) => {
        if (!id) return '-';
        if (id.length <= 8) return id;
        return `${id.slice(0, 4)}...${id.slice(-4)}`;
    };

    const copyToClipboard = async () => {
        if (gridUserId) {
            await Clipboard.setStringAsync(gridUserId);
        }
    };

    return (
        <ScreenLayout>
            <View style={styles.header}>
                <ThemedText type="highlight">Settings</ThemedText>
            </View>
            <View style={styles.section}>
                <ThemedText type="regularSemiBold" style={styles.sectionTitle}>Account:</ThemedText>
                <View style={styles.accountContainer}>
                    <View style={styles.accountInfo}>
                        <ThemedText type="regular">Email:</ThemedText>
                        <ThemedText type="regular" style={styles.infoText}>{email}</ThemedText>
                    </View>
                    <View style={styles.accountInfo}>
                        <ThemedText type="regular">KYC Status:</ThemedText>
                        <ThemedText type="regular" style={styles.infoText}>{formatKycStatus(kycStatus)}</ThemedText>
                    </View>
                    <View style={styles.accountInfo}>
                        <ThemedText type="regular">Grid User ID:</ThemedText>
                        <View style={styles.idContainer}>
                            <ThemedText type="regular" style={styles.infoText}>{formatGridUserId(gridUserId)}</ThemedText>
                            <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                                <Ionicons name="copy-outline" size={20} color={textColor} style={{ opacity: 0.6 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
        opacity: 0.6,
    },
    accountContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoText: {
        opacity: 0.8,
    },
    footer: {
        marginTop: 'auto',
        width: '100%',
        paddingBottom: Spacing.xxxl,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    copyButton: {
        padding: 4,
    },
});

