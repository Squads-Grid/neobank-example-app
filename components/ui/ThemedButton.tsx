import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';

interface ThemedButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'primaryInverted' | 'secondaryInverted' | 'onColorPrimary' | 'onColorSecondary';
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
    const primaryColor = useThemeColor({}, 'primary');
    const primaryLight = useThemeColor({}, 'primaryLight');
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const borderColor = useThemeColor({}, 'border');

    const getButtonStyle = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: disabled ? borderColor : primaryColor,
                    borderColor: disabled ? borderColor : primaryColor,
                };
            case 'secondary':
                return {
                    backgroundColor: disabled ? borderColor : primaryLight,
                    borderColor: disabled ? borderColor : primaryColor,
                };
            case 'outline':
                return {
                    backgroundColor: backgroundColor,
                    borderColor: disabled ? borderColor : primaryColor,
                };
            case 'onColorPrimary':
                return {
                    backgroundColor: '#384149',
                    borderColor: '#FFFFFF',
                };
            case 'onColorSecondary':
                return {
                    backgroundColor: '#ffffff',
                    borderColor: '#ffffff',
                };
            default:
                return {
                    backgroundColor: disabled ? borderColor : primaryColor,
                    borderColor: disabled ? borderColor : primaryColor,
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        switch (variant) {
            case 'primary':
                return {
                    color: disabled ? textColor : backgroundColor,
                };
            case 'secondary': {
                return {
                    color: disabled ? textColor : primaryColor,
                };
            }
            case 'outline':
                return {
                    color: disabled ? borderColor : primaryColor,
                };
            case 'onColorPrimary':
                return {
                    color: '#ffffff',
                };
            case 'onColorSecondary':
                return {
                    color: '#000000',
                };
            default:
                return {
                    color: disabled ? textColor : backgroundColor,
                };
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
            <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
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