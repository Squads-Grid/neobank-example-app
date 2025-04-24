import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemedScreenText } from './ThemedScreenText';
import { CircleButton } from './CircleButton';
import { Size, Height, Weight } from '@/constants/Typography';

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
        fontSize: Size.tiny,
        fontWeight: Weight.mediumWeight,
        lineHeight: Size.tiny * Height.lineHeightMedium,
        opacity: 0.4,
    },
    topText: {
        fontSize: Size.regular,
        fontWeight: Weight.semiBoldWeight,
        lineHeight: Size.regular * Height.lineHeightNormal,
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