import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ui/atoms';
import { CircleButton } from './CircleButton';

// Define interface for each option (like wallet or bank)
export interface ActionOption {
    key: string;
    title: string;
    description: string;
    icon: any;
    onPress: () => void;
    disabled?: boolean;
}

interface ModalOptionsListProps {
    options: ActionOption[];
}

export function ModalOptionsList({ options }: ModalOptionsListProps) {
    const arrowBackground = "#D5D5D5";

    return (
        <View>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={option.key}
                    style={[styles.option, option.disabled && styles.disabledOption]}
                    onPress={option.onPress}
                    disabled={option.disabled}
                >
                    <Image source={option.icon} style={[styles.icon, option.disabled && styles.disabledIcon]} />
                    <View style={styles.optionTextContainer}>
                        <ThemedText type="regularSemiBold" style={option.disabled && styles.disabledText}>{option.title}</ThemedText>
                        <ThemedText type="tiny" style={[styles.subText, option.disabled && styles.disabledText]}>{option.description}</ThemedText>
                    </View>
                    <View style={styles.arrowContainer}>
                        <CircleButton
                            icon="arrow-forward-outline"
                            label=""
                            onPress={option.onPress}
                            size={24}
                            backgroundColor={arrowBackground}
                            disabled={option.disabled}
                        />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    disabledOption: {
        opacity: 0.5,
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
        opacity: 0.4,
    },
    disabledText: {
        opacity: 0.5,
    },
    disabledIcon: {
        opacity: 0.5,
    },
    arrowContainer: {
        marginLeft: Spacing.sm,
    },
    icon: {
        width: 58,
        height: 34.1,
        resizeMode: 'contain',
        overflow: 'hidden'
    },
})