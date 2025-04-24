import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedScreenText } from './ThemedScreenText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { CircleButton } from './CircleButton';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StarburstModalBackground } from './StarburstModalBackground';
import { Weight } from '@/constants/Typography';
import { Size } from '@/constants/Typography';

// Main component props
interface ActionModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    useStarburstModal?: boolean;
    primaryColor?: string;
}

export function ActionModal({
    visible,
    onClose,
    title = '',
    children,
    useStarburstModal = false,
    primaryColor = '#0080FF'
}: ActionModalProps) {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const colorScheme = useColorScheme() || 'light';

    const overlayBackgroundColor = colorScheme === 'dark'
        ? 'rgba(51, 51, 51, 0.4)'
        : 'rgba(177, 177, 177, 0.40)';
    const blurTint = colorScheme === 'dark' ? 'dark' : 'light';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={30} style={[styles.overlay, { backgroundColor: overlayBackgroundColor }]} tint={blurTint}>
                <View style={[styles.modalContainer, { backgroundColor: useStarburstModal ? '#000' : backgroundColor }]}>
                    {useStarburstModal && (
                        <View style={styles.backgroundContainer}>
                            <StarburstModalBackground primaryColor={primaryColor} />
                        </View>
                    )}
                    <View style={styles.header}>
                        <ThemedScreenText type="subtitle" style={{ color: useStarburstModal ? 'white' : textColor }}>{title}</ThemedScreenText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={[styles.closeText, { color: useStarburstModal ? 'white' : textColor }]}>×</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentContainer}>
                        {children}
                    </View>
                </View>
            </BlurView>
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
        width: '90%',
        borderRadius: 32,
        padding: Spacing.lg,
        margin: 34,
        overflow: 'hidden',
        position: 'relative',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        zIndex: 1,
    },
    contentContainer: {
        zIndex: 1,
    },
    closeButton: {
        opacity: 0.25,
    },
    closeText: {
        fontSize: 28,
        fontWeight: '300',
    },
}); 