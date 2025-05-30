import React, { useMemo } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/ui/atoms';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/hooks/useColorScheme';
import WalletQRCode from '../WalletQRCode';

interface QRCodeModalProps {
    visible: boolean;
    onClose: () => void;
    walletAddress: string;
}

export function QRCodeModal({ visible, onClose, walletAddress }: QRCodeModalProps) {
    const colorScheme = useColorScheme() || 'light';

    const overlayBackgroundColor = colorScheme === 'dark'
        ? 'rgba(51, 51, 51, 0.4)'
        : 'rgba(177, 177, 177, 0.40)';
    const blurTint = colorScheme === 'dark' ? 'dark' : 'light';

    // Pre-render the QR code to prevent regeneration on modal visibility changes
    const qrCode = useMemo(() => (
        <WalletQRCode walletAddress={walletAddress} />
    ), [walletAddress]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <BlurView intensity={20} style={[styles.overlay, { backgroundColor: overlayBackgroundColor }]} tint={blurTint}>
                    <View style={styles.modalContainer}>
                        <ImageBackground
                            source={require('@/assets/images/qr-bg.png')}
                            style={[StyleSheet.absoluteFillObject, styles.imageBg]}
                            imageStyle={styles.imageBg}
                            resizeMode="cover"
                        />
                        <View style={styles.contentContainer}>
                            {qrCode}
                        </View>
                    </View>
                </BlurView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 0.7,
        borderRadius: 32,
        margin: Spacing.md,
        overflow: 'hidden',
        backgroundColor: 'red',
        padding: Spacing.xl,
    },
    imageBg: {
        borderRadius: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
    },
    closeButton: {
        opacity: 0.25,
        padding: Spacing.xs,
    },
    closeText: {
        fontSize: 28,
        fontWeight: '300',
    },
}); 