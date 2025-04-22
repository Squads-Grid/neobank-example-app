import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Spacing } from '@/constants/Spacing';

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

    const getButtonStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                };
            case 'secondary':
                return {
                    backgroundColor: 'transparent',
                    borderColor: primaryColor,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderColor: textColor,
                };
            default:
                return {
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
                // disabled && styles.disabled,
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
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 