import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';

interface ThemedTextInputProps extends TextInputProps {
    error?: boolean;
}

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(({ style, error, ...props }, ref) => {
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');
    const errorColor = useThemeColor({}, 'error');

    return (
        <TextInput
            ref={ref}
            style={[
                styles.input,
                {
                    borderColor: error ? errorColor : borderColor,
                    color: textColor,
                    backgroundColor: backgroundColor,
                },
                style,
            ]}
            placeholderTextColor={textColor + '80'}
            {...props}
        />
    );
});

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: Spacing.md,
        fontSize: 16,
        width: '100%',
    }
}); 