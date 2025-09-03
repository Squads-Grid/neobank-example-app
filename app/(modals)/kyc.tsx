import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { WithScreenTheme } from '@/components/WithScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { SwipeableModal, OverlappingImages, InAppBrowser } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText } from '@/components/ui/atoms';
import { Link } from 'expo-router';
import { ThemedButton, ThemedTextInput } from '@/components/ui/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { useKyc } from '@/hooks/useKyc';
import { KycParams } from '@/types/Kyc';
import * as Sentry from '@sentry/react-native';

function KYCModal() {
    const { textColor } = useScreenTheme();
    const { user, email } = useAuth();
    const { status, isLoading, startKyc, checkStatus, tosStatus } = useKyc();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showNameInputs, setShowNameInputs] = useState(false);
    const [kycUrl, setKycUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);
    const [tosUrl, setTosUrl] = useState<string | null>(null);
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);
    const params = useLocalSearchParams();
    const source = params.source;

    useEffect(() => {
        if (status === 'approved' && tosStatus === 'approved') {
            if (source === 'receive') {
                router.replace('/bankdetails');
            } else {
                router.replace('/(send)/fiatamount');
            }
        }
    }, [status, tosStatus]);

    const handleClose = () => {
        router.back();
    };

    const handleInitialContinue = () => {
        setShowNameInputs(true);
    };

    const handleSubmit = async () => {
        Keyboard.dismiss();
        setIsSubmitting(true);
        setShowChecklist(true);

        if (!user || !email) {
            return;
        }

        try {
            const params: KycParams = {
                grid_user_id: user.grid_user_id!,
                smart_account_address: user.address!,
                email: email,
                full_name: `${firstName} ${lastName}`.trim(),
                redirect_uri: null
            };

            const result = await startKyc(params);
            const { kycLink, tosLink } = result;
            setKycUrl(kycLink);
            setTosUrl(tosLink);

        } catch (err) {
            console.error('Error starting KYC:', err);
            Sentry.captureException(new Error(`Error starting KYC: ${err}. (modals)/kyc.tsx (handleSubmit)`));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNavigationStateChange = async (navState: any) => {
        // Check if we're on the completion or success page
        const isCompletionPage = navState.url.includes('/completion') ||
            navState.url.includes('/success') ||
            navState.url.includes('status=complete');

        if (isCompletionPage) {
            await checkStatus(); // This will update the status in the hook
            handleClose();
        }
    };

    const renderContent = () => {

        return showChecklist ? (
            <View style={styles.contentContainer}>
                <ThemedButton
                    title={tosStatus === 'approved' ? `Terms of Service Accepted` : `Accept Terms of Service`}
                    disabled={tosStatus === 'approved'}
                    onPress={() => setCurrentUrl(tosUrl)} />
                <ThemedButton
                    title={status === 'approved' ? `Kyc Completed` : `Complete Kyc`}
                    disabled={status !== 'not_started' && status !== 'incomplete'}
                    onPress={() => setCurrentUrl(kycUrl)} />
            </View>
        ) : (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <View style={styles.contentContainer}>
                    {!showNameInputs && !showChecklist ? (
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
        );
    };

    return (
        <ThemedScreen>
            <SwipeableModal onDismiss={handleClose}>
                <StarburstBank primaryColor={"#0080FF"} />
                {isLoading || isSubmitting ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={textColor} />
                    </View>
                ) : (
                    renderContent()
                )}
            </SwipeableModal>
            <InAppBrowser
                visible={!!currentUrl}
                onClose={() => {
                    setCurrentUrl(null);
                    checkStatus();
                }
                }
                url={currentUrl || ''}
                onNavigationStateChange={handleNavigationStateChange}
            />
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    checklistContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.xl,
        gap: Spacing.md
    },
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
    },
});

export default WithScreenTheme(KYCModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});