import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Spacing } from '@/constants/Spacing';
import tinycolor from 'tinycolor2';
import { Size, Weight } from '@/constants/Typography';

interface ThemedButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export function ThemedButton({
    onPress,
    title,
    variant = 'primary',
    style,
    textStyle,
    disabled = false,
}: ThemedButtonProps) {
    const { primaryColor, backgroundColor, textColor } = useScreenTheme();
    const primaryColorInstance = tinycolor(primaryColor);

    const getButtonStyle = (): ViewStyle => {
        const baseStyle = {
            opacity: disabled ? 0.5 : 1,
        };

        switch (variant) {
            case 'primary':
                return {
                    ...baseStyle,
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    backgroundColor: primaryColorInstance.setAlpha(0.1).toRgbString(),
                    borderColor: primaryColorInstance.setAlpha(0.4).toRgbString(),
                };
            case 'outline':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderColor: textColor,
                    borderWidth: 1,
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: primaryColor,
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
        fontWeight: Weight.semiBoldWeight,
    },
}); 