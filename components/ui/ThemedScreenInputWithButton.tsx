import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Spacing } from '@/constants/Spacing';
import { CircleButton } from './CircleButton';
interface ThemedScreenInputWithButtonProps extends Omit<TextInputProps, 'style'> {
    onButtonPress: () => void;
    buttonIcon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
    buttonDisabled?: boolean;
    buttonSize?: number;
    style?: StyleProp<ViewStyle>;
    inputStyle?: TextInputProps['style'];
    error?: boolean;
}

export const ThemedScreenInputWithButton = forwardRef<TextInput, ThemedScreenInputWithButtonProps>(
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
        const { textColor, backgroundColor, primaryColor } = useScreenTheme();
        const errorColor = '#FF3B30'; // Standard error color

        // Determine button color logic (invert of background color)
        const isBackgroundDark = backgroundColor === '#000000' || backgroundColor.toLowerCase() === '#000';
        const buttonBackground = isBackgroundDark ? '#FFFFFF' : '#000000';
        const iconColor = isBackgroundDark ? '#000000' : '#FFFFFF';

        return (
            <View
                style={[
                    styles.container,
                    {
                        borderColor: error ? errorColor : textColor + '20',
                        backgroundColor: buttonBackground + '40', // Semi-transparent background
                    },
                    style,
                ]}
            >
                <TextInput
                    ref={ref}
                    style={[
                        styles.input,
                        {
                            color: textColor,
                        },
                        inputStyle,
                    ]}
                    placeholderTextColor={textColor + '80'}
                    {...textInputProps}
                />
                <CircleButton
                    icon={buttonIcon}
                    label="" // No label needed visually inside the input
                    onPress={onButtonPress}
                    size={buttonSize}
                    backgroundColor={buttonBackground}
                    iconColor={iconColor}
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
        fontSize: 16,
        padding: Spacing.md,
    },
    button: {
        flex: 1,
        fontSize: 18,
        marginRight: Spacing.sm,
        paddingVertical: 0,
        marginLeft: Spacing.md,
    },
}); 