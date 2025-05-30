import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CircleButton } from './CircleButton';
import { Spacing } from '@/constants/Spacing';

interface ButtonItem {
    icon: React.ComponentProps<typeof CircleButton>['icon'];
    label: string;
    onPress: () => void;
    color?: string;
    textColor?: string;
}

interface CircleButtonGroupProps {
    buttons: ButtonItem[];
}

export function CircleButtonGroup({ buttons }: CircleButtonGroupProps) {
    return (
        <View style={styles.container}>
            {buttons.map((button, index) => (
                <View key={index} style={styles.itemContainer}>
                    <CircleButton
                        icon={button.icon}
                        label={button.label}
                        onPress={button.onPress}
                        backgroundColor={button.color}
                        customTextColor={button.textColor}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
    },
}); 