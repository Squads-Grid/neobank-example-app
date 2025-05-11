import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { SwipeableModal, OverlappingImages } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText } from '@/components/ui/atoms';
import { Link } from 'expo-router';
import { ThemedButton } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { easClient } from '@/utils/easClient';

function KYCModal() {
    const { textColor } = useScreenTheme();
    const { kycStatus, accountInfo, logout, updateKycStatus } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!kycStatus) {
            setIsLoading(true);
            checkKycStatus();
            setIsLoading(false);
        }
    }, [kycStatus]);

    const checkKycStatus = async () => {
        if (!accountInfo) {
            logout();
            return;
        }

        try {
            const response = await easClient.getUser(accountInfo?.grid_user_id);
            const { bridge_kyc_link } = response.data;
            if (!bridge_kyc_link) {
                setIsLoading(false);
                updateKycStatus('NotStarted');
                return;
            } else {
                // get kyc status
            }

        } catch (err) {
            console.error('Error checking KYC status:', err);
            // setError('Failed to check KYC status');
        }
    };

    const handleClose = () => {
        router.back();
    };

    const renderContent = () => {
        return (
            <>
                <View style={styles.contentContainer}>
                    <View style={styles.flagContainer}>
                        <OverlappingImages
                            leftImage={require('@/assets/images/bridge.png')}
                            rightImage={require('@/assets/images/starburst-round.png')}
                            size={64}
                            overlap={0.3}
                            borderWidth={0}
                        />
                    </View>
                    <ThemedText type="large" style={styles.headline}>
                        Continue with Bridge for identity verification
                    </ThemedText>
                    <ThemedText type="regular" style={[styles.subtitle, { color: textColor + 40 }]}>
                        Complete verification with Bridge.xyz and your account details will automatically appear in your Bright App.
                    </ThemedText>
                </View>
                <ThemedText type="tiny" style={[styles.footerText, { color: textColor + 40 }]}>
                    By pressing continue, you agree to the <Link href="https://bridge.xyz/terms-of-service">Terms and conditions</Link>.
                </ThemedText>
                <ThemedButton
                    onPress={() => { }}
                    title="Continue"
                />
            </>
        )
    }

    return (
        <ThemedScreen>
            <SwipeableModal onDismiss={handleClose}>
                <StarburstBank primaryColor={"#0080FF"} />
                {isLoading ?
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator />
                    </View>
                    : renderContent()}
            </SwipeableModal>
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flagContainer: {
        alignItems: 'center',
        marginBottom: Spacing.md
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.xl,
        gap: Spacing.md
    },
    headline: {
        textAlign: 'center',
        paddingHorizontal: Spacing.lg
    },
    subtitle: {
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    footerText: {
        width: '80%',
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: Spacing.xl
    }
});

export default withScreenTheme(KYCModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});