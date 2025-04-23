import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedScreenText } from './ThemedScreenText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { CircleButton } from './CircleButton';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define interface for each option (like wallet or bank)
export interface ActionOption {
    key: string;
    title: string;
    description: string;
    icon: any; // Image source
    onPress: () => void;
}

// Main component props
interface ActionModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: ActionOption[];
}

export function ActionModal({ visible, onClose, title, options }: ActionModalProps) {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');
    const colorScheme = useColorScheme() || 'light';

    const arrowBackground = "#D5D5D5";

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
                <View style={[styles.modalContainer, { backgroundColor }]}>
                    <View style={styles.header}>
                        <ThemedScreenText type="defaultSemiBold" style={styles.title}>{title}</ThemedScreenText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={[styles.closeText, { color: textColor }]}>×</Text>
                        </TouchableOpacity>
                    </View>

                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={option.key}
                            style={styles.option}
                            onPress={option.onPress}
                        >
                            <Image source={option.icon} style={styles.icon} />
                            <View style={styles.optionTextContainer}>
                                <ThemedScreenText type="default" style={styles.topText}>{option.title}</ThemedScreenText>
                                <ThemedScreenText type="default" style={styles.subText}>{option.description}</ThemedScreenText>
                            </View>
                            <View style={styles.arrowContainer}>
                                <CircleButton
                                    icon="arrow-forward-outline"
                                    label=""
                                    onPress={option.onPress}
                                    size={24}
                                    backgroundColor={arrowBackground}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
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
    arrowContainer: {
        marginLeft: Spacing.sm,
    },
}); 