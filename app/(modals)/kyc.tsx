import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useGlobalSearchParams } from 'expo-router';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen, StarburstBank } from '@/components/ui/layout';
import { Spacing } from '@/constants/Spacing';
import { SwipeableModal, OverlappingImages } from '@/components/ui/organisms';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { ThemedText } from '@/components/ui/atoms';
import { Link } from 'expo-router';
import { ThemedButton } from '@/components/ui/molecules';

function KYCModal() {
    const params = useGlobalSearchParams();
    const initialCurrency = params.currency as string || 'USD';

    const [error, setError] = useState<string | null>(null);
    const { backgroundColor, textColor } = useScreenTheme();

    // Handle close modal
    const handleClose = () => {
        router.back();
    };

    return (

        <ThemedScreen>
            <SwipeableModal onDismiss={handleClose}>
                <StarburstBank primaryColor={error ? '#FF0048' : "#0080FF"} />
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
            </SwipeableModal>
        </ThemedScreen>

    );
}

export default withScreenTheme(KYCModal, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({

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
    iconContainer: {
        padding: 7,
        borderRadius: 10
    },

    subtitle: {
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
    },
    infoValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: Spacing.md
    },
    footerText: {
        width: '80%',
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: Spacing.xl
    }
}); 