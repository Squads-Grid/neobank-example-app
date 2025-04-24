import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Spacing } from '@/constants/Spacing';
import tinycolor from 'tinycolor2';
import { Size } from '@/constants/Typography';

interface ThemedScreenButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export function ThemedScreenButton({
    onPress,
    title,
    variant = 'primary',
    style,
    textStyle,
    disabled = false,
}: ThemedScreenButtonProps) {
    const { primaryColor, backgroundColor, textColor } = useScreenTheme();
    const primaryColorInstance = tinycolor(primaryColor);

    const getButtonStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                };
            case 'secondary':
                return {
                    backgroundColor: primaryColorInstance.setAlpha(0.1).toRgbString(),
                    borderColor: primaryColorInstance.setAlpha(0.4).toRgbString(),
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: textColor,
                    borderWidth: 1,
                };
            default:
                return {
                    backgroundColor: 'red',
                    borderColor: primaryColor,
                };
        }
    };

    const getTextColor = (): string => {
        switch (variant) {
            case 'primary':
                return backgroundColor;
            case 'secondary':
                return textColor;
            case 'outline':
                return textColor;
            default:
                return backgroundColor;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text
                style={[
                    styles.text,
                    { color: getTextColor() },
                    // disabled && styles.disabledText,
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: Spacing.md,
        borderRadius: 42,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        fontSize: Size.medium,
        fontWeight: '600',
    },
}); 