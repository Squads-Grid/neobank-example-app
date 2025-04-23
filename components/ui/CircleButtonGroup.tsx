import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CircleButton } from './CircleButton';
import { Spacing } from '@/constants/Spacing';

interface ButtonItem {
    icon: React.ComponentProps<typeof CircleButton>['icon'];
    label: string;
    onPress: () => void;
}

interface CircleButtonGroupProps {
    buttons: ButtonItem[];
}

export function CircleButtonGroup({ buttons }: CircleButtonGroupProps) {
    return (
        <View style={styles.container}>
            {buttons.map((button, index) => (
                <CircleButton
                    key={index}
                    icon={button.icon}
                    label={button.label}
                    onPress={button.onPress}
                />
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
}); 