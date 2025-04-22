import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Spacing } from '@/constants/Spacing';

interface ThemedScreenTextInputProps extends TextInputProps {
    error?: boolean;
}

export const ThemedScreenTextInput = forwardRef<TextInput, ThemedScreenTextInputProps>(
    ({ style, error, ...props }, ref) => {
        const { textColor, backgroundColor, primaryColor } = useScreenTheme();
        const errorColor = '#FF3B30'; // Standard error color

        return (
            <TextInput
                ref={ref}
                style={[
                    styles.input,
                    {
                        borderColor: error ? errorColor : textColor,
                        color: textColor,
                        backgroundColor: backgroundColor,
                    },
                    style,
                ]}
                placeholderTextColor={textColor + '80'}
                {...props}
            />
        );
    }
);

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: Spacing.md,
        fontSize: 16,
        width: '100%',
    }
}); 