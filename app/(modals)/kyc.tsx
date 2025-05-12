import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { SwipeableModal, OverlappingImages } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText } from '@/components/ui/atoms';
import { Link } from 'expo-router';
import { ThemedButton, ThemedTextInput } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { easClient } from '@/utils/easClient';

function KYCModal() {
    const { textColor } = useScreenTheme();
    const { kycStatus, accountInfo, logout, updateKycStatus, email } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showNameInputs, setShowNameInputs] = useState(false);
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.status === 'success') {
            // Handle successful KYC completion
            updateKycStatus('Approved');
            router.back();
        }
    }, [params]);

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
        }
    };

    const handleClose = () => {
        router.back();
    };

    const handleInitialContinue = () => {
        setShowNameInputs(true);
    };

    const handleSubmit = async () => {
        if (!accountInfo || !email) {
            logout();
            return;
        }

        const response = await easClient.getKYCLink({
            grid_user_id: accountInfo?.grid_user_id,
            smart_account_address: accountInfo?.smart_account_address,
            email: email,
            full_name: `${firstName} ${lastName}`.trim(),
            redirect_uri: 'https://squads.so' // TODO: Replace with deeplink
        });

        if (response.data.kyc_link) {
            // Open the KYC link in the device's browser
            Linking.openURL(response.data.kyc_link);
        }
    }

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
                        title={showNameInputs ? "Submit" : "Continue"}
                        disabled={showNameInputs && (!firstName.trim() || !lastName.trim())}
                    />
                </View>
            </KeyboardAvoidingView>
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