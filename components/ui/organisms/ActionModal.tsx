import React, { ReactElement, useMemo } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/ui/atoms';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Props for the ActionModal component
 * @interface ActionModalProps
 * @property {boolean} visible - Controls the visibility of the modal
 * @property {() => void} onClose - Callback function when the modal is closed
 * @property {string} [title] - Optional title displayed at the top of the modal
 * @property {React.ReactNode} children - Content to be displayed in the modal
 * @property {boolean} [useStarburstModal] - Whether to use the starburst background style
 * @property {string} [primaryColor] - Primary color for the starburst background
 */
export interface ActionModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    useStarburstModal?: boolean;
    primaryColor?: string;
}

/**
 * A reusable modal component with customizable styling and content
 * @param {ActionModalProps} props - The component props
 * @returns {ReactElement} The rendered modal component
 */
export function ActionModal({
    visible,
    onClose,
    title = '',
    children,
    useStarburstModal = false,
    primaryColor = '#0080FF'
}: ActionModalProps): ReactElement {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const colorScheme = useColorScheme() || 'light';

    const overlayBackgroundColor = colorScheme === 'dark'
        ? 'rgba(51, 51, 51, 0.4)'
        : 'rgba(177, 177, 177, 0.40)';
    const blurTint = colorScheme === 'dark' ? 'dark' : 'light';

    // Memoize the header to prevent re-renders
    const header = useMemo(() => (
        <View style={styles.header}>
            <ThemedText type="subtitle" style={{ color: useStarburstModal ? 'white' : textColor }}>{title}</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeText, { color: useStarburstModal ? 'white' : textColor }]}>×</Text>
            </TouchableOpacity>
        </View>
    ), [title, useStarburstModal, textColor, onClose]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <BlurView intensity={20} style={[styles.overlay, { backgroundColor: overlayBackgroundColor }]} tint={blurTint}>
                    <View style={[styles.modalContainer, { backgroundColor: useStarburstModal ? '#000' : backgroundColor }]}>
                        {header}
                        <View style={styles.contentContainer}>
                            {children}
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