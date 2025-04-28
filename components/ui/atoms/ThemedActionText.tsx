import React from 'react';
import { Text, TextProps, StyleSheet, TouchableOpacity } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Size, Weight } from '@/constants/Typography';

interface ThemedActionTextProps extends Omit<TextProps, 'style'> {
    onPress?: () => void;
    disabled?: boolean;
    countdown?: number;
    disabledText?: string;
    activeText?: string;
    style?: TextProps['style'];
}

export function ThemedActionText({
    onPress,
    disabled = false,
    countdown,
    disabledText = 'Resend code',
    activeText = 'Resend code',
    style,
    ...props
}: ThemedActionTextProps) {
    const { textColor } = useScreenTheme();

    const getDisplayText = () => {
        if (disabled && countdown !== undefined) {
            return `${disabledText} ${countdown}s`;
        }
        return activeText;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={styles.container}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: disabled ? textColor + '60' : textColor,
                    },
                    style,
                ]}
                {...props}
            >
                {getDisplayText()}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: Size.medium,
        fontWeight: Weight.mediumWeight,
    },
}); 