import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedScreenButton } from './ThemedScreenButton';

interface ButtonGroupProps {
    primaryTitle: string;
    primaryOnPress: () => void;
    secondaryTitle: string;
    secondaryOnPress: () => void;
    primaryVariant?: 'primary' | 'secondary';
    secondaryVariant?: 'primary' | 'secondary';
    style?: any;
}

export function ButtonGroup({
    primaryTitle,
    primaryOnPress,
    secondaryTitle,
    secondaryOnPress,
    primaryVariant = 'primary',
    secondaryVariant = 'secondary',
    style,
}: ButtonGroupProps) {
    return (
        <View style={[styles.buttonContainer, style]}>
            <ThemedScreenButton
                title={primaryTitle}
                onPress={primaryOnPress}
                variant={primaryVariant}
                style={styles.button}
            />
            <ThemedScreenButton
                title={secondaryTitle}
                onPress={secondaryOnPress}
                variant={secondaryVariant}
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