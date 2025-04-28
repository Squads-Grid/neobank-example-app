import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedScreenButton } from './ThemedScreenButton';

interface ButtonGroupProps {
    leftTitle: string;
    leftOnPress: () => void;
    rightTitle: string;
    rightOnPress: () => void;
    leftVariant?: 'primary' | 'secondary' | 'outline';
    rightVariant?: 'primary' | 'secondary' | 'outline';
    style?: any;
}

export function ButtonGroup({
    leftTitle,
    leftOnPress,
    rightTitle,
    rightOnPress,
    leftVariant = 'primary',
    rightVariant = 'secondary',
    style,
}: ButtonGroupProps) {

    return (
        <View style={[styles.buttonContainer, style]}>
            <ThemedScreenButton
                title={leftTitle}
                onPress={leftOnPress}
                variant={leftVariant}
                style={styles.button}
            />
            <ThemedScreenButton
                title={rightTitle}
                onPress={rightOnPress}
                variant={rightVariant}
                style={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
    },
}); 