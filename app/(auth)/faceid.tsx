import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedScreen } from '@/components/ui/layout';
import { ThemedText } from '@/components/ui/atoms';
import { ThemedButton } from '@/components/ui/molecules';
import { IconSymbol } from '@/components/ui/atoms';
import { StarburstFull } from '@/components/ui/layout';
import { withScreenTheme } from '@/components/withScreenTheme';
import { Spacing } from '@/constants/Spacing';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { router } from 'expo-router';

interface FaceIDScreenProps {
    show2FA: boolean;
}

export function FaceIDScreen({ show2FA }: FaceIDScreenProps) {
    const { textColor } = useScreenTheme();

    const handleEnable2FA = () => {
        // TODO: Implement Face ID/2FA logic or navigation
        // setTimeout(() => {
        //     router.push('/(sign)/success');
        // }, 1000);
    };

    return (
        <ThemedScreen style={styles.container}>
            <StarburstFull primaryColor="#0080FF" opacity={0.7} style={StyleSheet.absoluteFillObject} />
            <View style={styles.content}>
                <IconSymbol name="faceid" size={64} color={textColor} />
                <ThemedText type="default" style={styles.textStyle}>
                    Enable Face ID to{"\n"}protect your account
                </ThemedText>
                {show2FA && <ThemedButton
                    title="Enable 2FA"
                    onPress={handleEnable2FA}
                    style={styles.button}
                />}
            </View>
        </ThemedScreen>
    );
}

export default withScreenTheme(FaceIDScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    textStyle: {
        textAlign: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    button: {
        width: 150,
    },
}); 