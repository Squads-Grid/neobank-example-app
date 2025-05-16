import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { SwipeableModal, OverlappingImages, InAppBrowser } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText } from '@/components/ui/atoms';
import { Link } from 'expo-router';
import { ThemedButton, ThemedTextInput } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { easClient } from '@/utils/easClient';
import { KycStatus, KycParams } from '@/types/Kyc';
import * as SecureStore from 'expo-secure-store';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';

function KYCModal() {
    const { textColor } = useScreenTheme();
    const { accountInfo, logout, email } = useAuth();
    const { fetchKycStatus, kycStatus, setKycStatus } = useModalFlow();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showNameInputs, setShowNameInputs] = useState(false);
    const [kycUrl, setKycUrl] = useState<string | null>(null);
    const [kycLinkId, setKycLinkId] = useState<string | null>(null);

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
            const gridUserId = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID);
            if (!gridUserId) {
                logout();
                return;
            }

            const response = await easClient.getUser(gridUserId);
            const { bridge_kyc_link, bridge_kyc_link_id } = response.data;
            if (!bridge_kyc_link) {
                setIsLoading(false);
                setKycStatus('not_started');
                return;
            } else {
                setKycLinkId(bridge_kyc_link_id);
                // get kyc status
            }
        } catch (err) {
            console.error('Error checking KYC status:', err);
        }
    };

    const handleClose = () => {
        router.back();
    };

    const handleInitialContinue = () => {
        setShowNameInputs(true);
    };

    const handleSubmit = async () => {
        Keyboard.dismiss();

        const gridUserId = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID);
        if (!gridUserId || !accountInfo || !email) {
            logout();
            return;
        }

        try {
            const response = await easClient.getKYCLink({
                grid_user_id: gridUserId,
                smart_account_address: accountInfo?.smart_account_address,
                email: email,
                full_name: `${firstName} ${lastName}`.trim()
            } as KycParams);

            if (response.data.kyc_link) {
                setKycUrl(response.data.kyc_link);
                setKycLinkId(response.data.id);
                setKycStatus('incomplete');
            }
        } catch (err) {
            console.error('Error getting KYC link:', err);
        }
    }

    const handleNavigationStateChange = async (navState: any) => {
        // Check if we're on the completion or success page
        const isCompletionPage = navState.url.includes('/completion') ||
            navState.url.includes('/success') ||
            navState.url.includes('status=complete');

        if (isCompletionPage && kycLinkId && accountInfo?.smart_account_address) {
            try {
                // Poll for KYC status
                const response = await easClient.getKYCStatus(
                    accountInfo.smart_account_address,
                    kycLinkId
                );

                const newStatus = response.data.status;
                if (newStatus !== kycStatus) {
                    setKycStatus(newStatus);
                    if (newStatus === 'approved' || newStatus === 'rejected') {
                        // Close the WebView and modal if KYC is complete
                        setKycUrl(null);
                        handleClose();
                    }
                }
            } catch (err) {
                console.error('Error checking KYC status:', err);
            }
        }
    };

    const renderContent = () => {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <View style={styles.contentContainer}>
                    {!showNameInputs ? (
                        <>
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
                        </>
                    ) : (
                        <View style={styles.inputContainer}>
                            <ThemedTextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                                style={[styles.input, { backgroundColor: textColor + 10 }]}
                                inputStyle={{ color: textColor }}
                            />
                            <ThemedTextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                                style={[styles.input, { backgroundColor: textColor + 10 }]}
                                inputStyle={{ color: textColor }}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.bottomContainer}>
                    <ThemedText type="tiny" style={[styles.footerText, { color: textColor + 40 }]}>
                        By pressing continue, you agree to the <Link href="https://bridge.xyz/terms-of-service">Terms and conditions</Link>.
                    </ThemedText>
                    <ThemedButton
                        onPress={showNameInputs ? handleSubmit : handleInitialContinue}
                        title={showNameInputs ? "Submit" : (disableButton() && kycStatus ? `Kyc status: ${kycStatus}` : "Continue")}
                        disabled={disableButton()}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }

    const disableButton = () => {
        if (!kycStatus || (kycStatus !== 'approved' && kycStatus !== 'not_started')) {
            return true
        }
        if (showNameInputs && ((!firstName.trim() || !lastName.trim()))) {
            return true
        }
        return false
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
            <InAppBrowser
                visible={!!kycUrl}
                onClose={handleClose}
                url={kycUrl || ''}
                onNavigationStateChange={handleNavigationStateChange}
            />
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
    },
    inputContainer: {
        width: '100%',
        gap: Spacing.sm,
        marginTop: Spacing.md
    },
    input: {
        width: '100%'
    },
    bottomContainer: {
        width: '100%',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.md
    }
});

export default withScreenTheme(KYCModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});