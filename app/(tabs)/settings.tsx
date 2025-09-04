import { ThemedText } from '@/components/ui/atoms';
import { ThemedButton } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/layout';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as SecureStore from 'expo-secure-store';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useKyc } from '@/hooks/useKyc';

export default function SettingsScreen() {
    const { logout, user, email, isLoggingOut } = useAuth();
    const { status: kycStatus, checkStatus } = useKyc();
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const [gridUserId, setGridUserId] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            const id = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID);
            if (id) setGridUserId(id);
            await checkStatus();
        };
        loadData();
    }, []);

    const formatKycStatus = (status: string | null) => {
        if (!status) return 'Not Started';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatGridUserId = (id: string) => {
        if (!id) return '-';
        if (id.length <= 8) return id;
        return `${id.slice(1, 5)}...${id.slice(-5)}`;
    };

    const copyToClipboard = async () => {
        if (gridUserId) {
            await Clipboard.setStringAsync(gridUserId);
        }
    };

    return (
        <ScreenLayout>

            <View style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: textColor + 10, padding: Spacing.sm }}>
                <View style={[styles.sectionHeaderContainer]}>
                    <ThemedText type="defaultSemiBold" style={styles.groupTitle}>
                        Account Details
                    </ThemedText>
                </View>
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
                        <ThemedText type="regular" style={styles.infoText}>{formatGridUserId(user?.grid_user_id ?? '').replaceAll('\"', '')}</ThemedText>
                        <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                            <Ionicons name="copy-outline" size={20} color={textColor} style={{ opacity: 0.6 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
                <ThemedButton
                    title={isLoggingOut ? "Logging out..." : "Logout"}
                    onPress={logout}
                    variant="primary"
                    textStyle={{ color: backgroundColor }}
                    disabled={isLoggingOut}
                />
                {isLoggingOut && (
                    <View style={styles.logoutSpinner}>
                        <ActivityIndicator size="small" color={textColor} />
                        <ThemedText style={styles.logoutText}>Logging you out...</ThemedText>
                    </View>
                )}
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
    container: {
        flex: 1,
        width: '100%',
    },
    contentContainer: {
        flexGrow: 1,
    },
    sectionHeaderContainer: {
        paddingTop: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        zIndex: 1,
    },
    groupTitle: {
        opacity: 0.23,
        marginBottom: Spacing.sm,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: Spacing.xl,
        opacity: 0.5,
    },
    logoutSpinner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.sm,
        gap: Spacing.xs,
    },
    logoutText: {
        fontSize: 14,
        opacity: 0.7,
    },
});