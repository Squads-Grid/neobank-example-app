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
                    style={styles.option}
                    onPress={option.onPress}
                >
                    <Image source={option.icon} style={styles.icon} />
                    <View style={styles.optionTextContainer}>
                        <ThemedText type="regularSemiBold">{option.title}</ThemedText>
                        <ThemedText type="tiny" style={styles.subText}>{option.description}</ThemedText>
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
    );
}

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
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