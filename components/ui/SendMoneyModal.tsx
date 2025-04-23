import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedScreenText } from './ThemedScreenText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';

interface SendMoneyModalProps {
    visible: boolean;
    onClose: () => void;
    onSendToWallet: () => void;
    onSendToBank: () => void;
}

export function SendMoneyModal({ visible, onClose, onSendToWallet, onSendToBank }: SendMoneyModalProps) {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');

    const bankIcon = require('@/assets/icons/bank.png');
    const walletIcon = require('@/assets/icons/wallet.png');

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={10} style={styles.overlay} tint="dark">
                <View style={[styles.modalContainer, { backgroundColor }]}>
                    <View style={styles.header}>
                        <ThemedScreenText type="defaultSemiBold" style={styles.title}>Send</ThemedScreenText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={[styles.closeText, { color: textColor }]}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.option, { borderBottomColor: borderColor }]}
                        onPress={onSendToWallet}
                    >
                        <Image source={walletIcon} style={styles.icon} />
                        <View style={styles.optionTextContainer}>
                            <ThemedScreenText type="default" style={styles.topText}>To Wallet</ThemedScreenText>
                            <ThemedScreenText type="default" style={styles.subText}>Send assets to wallet address</ThemedScreenText>
                        </View>
                        <Text style={[styles.arrow, { color: textColor }]}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={onSendToBank}
                    >
                        <Image source={bankIcon} style={styles.icon} />
                        <View style={styles.optionTextContainer}>
                            <ThemedScreenText type="default" style={styles.topText}> To Bank Account</ThemedScreenText>
                            <ThemedScreenText type="default" style={styles.subText}>Send USDC to Bank Account</ThemedScreenText>
                        </View>
                        <Text style={[styles.arrow, { color: textColor }]}>›</Text>
                    </TouchableOpacity>
                </View>
            </BlurView >
        </Modal >
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    modalContainer: {
        width: '90%',
        borderRadius: 32,
        padding: Spacing.lg,
        margin: 34,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        opacity: 0.25,
    },
    closeText: {
        fontSize: 28,
        fontWeight: '300',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    icon: {
        width: 58,
        height: 34.1,
        resizeMode: 'contain',
        overflow: 'hidden'
    },
    optionTextContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: Spacing.xxs,
        height: 34.1,
        marginLeft: Spacing.sm,
    },
    subText: {
        fontSize: 12,
        lineHeight: 12,
        opacity: 0.4,
    },
    topText: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 14,
    },
    arrow: {
        fontSize: 24,
        fontWeight: '300',
        marginLeft: Spacing.sm,
    },
}); 