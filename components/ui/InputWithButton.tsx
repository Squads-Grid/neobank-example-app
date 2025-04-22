import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { CircleButton } from './CircleButton'; // Assuming CircleButton is in the same directory
import tinycolor from 'tinycolor2';

interface InputWithButtonProps extends Omit<TextInputProps, 'style'> {
    onButtonPress: () => void;
    buttonIcon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap; // Optional icon override
    buttonDisabled?: boolean;
    buttonSize?: number;
    style?: StyleProp<ViewStyle>; // Style for the outer container
    inputStyle?: TextInputProps['style']; // Specific style for the TextInput itself
    error?: boolean;
}

export const InputWithButton = forwardRef<TextInput, InputWithButtonProps>(
    (
        {
            style,
            inputStyle,
            onButtonPress,
            buttonIcon = 'arrow-forward',
            buttonDisabled = false,
            buttonSize = 45,
            error,
            ...textInputProps
        },
        ref
    ) => {
        const borderColor = useThemeColor({}, 'border');
        // Fetch text color suitable for dark/colored backgrounds
        const textColor = useThemeColor({}, 'textOnColored');
        const backgroundColor = useThemeColor({}, 'background'); // Base color for fixed background calculation
        const errorColor = useThemeColor({}, 'error'); // Assuming you added 'error' color
        const iconColor = useThemeColor({}, 'text');

        const containerBorderColor = error ? errorColor : borderColor;
        const bgColorInstance = tinycolor(backgroundColor);

        return (
            <View
                style={[
                    styles.container,
                    {
                        borderColor: bgColorInstance.setAlpha(0.2).toRgbString(),
                        backgroundColor: bgColorInstance.setAlpha(0.4).toRgbString(),
                    },
                    style, // Merge passed container style
                ]}
            >
                <TextInput
                    ref={ref}
                    style={[
                        styles.input,
                        { color: textColor, },
                        inputStyle, // Merge passed input style
                    ]}
                    placeholderTextColor={textColor}
                    {...textInputProps} // Pass all other TextInput props
                />
                <CircleButton
                    icon={buttonIcon}
                    label="" // No label needed visually inside the input
                    onPress={onButtonPress}
                    size={buttonSize}
                    backgroundColor={backgroundColor}
                    iconColor={iconColor}
                // Add disabled prop handling if CircleButton supports it
                // disabled={buttonDisabled}
                />
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 421,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        width: '100%',
    },
    input: {
        flex: 1,
        fontSize: 18,
        marginRight: Spacing.sm,
        paddingVertical: 0,
        marginLeft: Spacing.md,
    },
}); 