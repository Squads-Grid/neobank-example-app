import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Size, Weight } from '@/constants/Typography';

interface CircleButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    size?: number;
    backgroundColor?: string;
    iconColor?: string;
    disabled?: boolean;
    customTextColor?: string;
}

export function CircleButton({
    icon,
    label,
    onPress,
    size = 45,
    backgroundColor: customBackgroundColor,
    iconColor: customIconColor,
    disabled = false,
    customTextColor,
}: CircleButtonProps) {
    const themeBackgroundColor = useThemeColor({}, 'primary');
    const themeIconColor = useThemeColor({}, 'background');

    const backgroundColor = customBackgroundColor || themeBackgroundColor;
    const buttonTextColor = customIconColor || themeIconColor;

    const textColor = useThemeColor({}, 'text');
    const shadowColor = useThemeColor({}, 'border');

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                style={[
                    styles.button,
                    {
                        width: size,
                        height: size,
                        backgroundColor: backgroundColor,
                        shadowColor: shadowColor,
                        opacity: disabled ? 0.5 : 1,
                    }
                ]}
            >
                <Ionicons
                    name={icon}
                    size={size * 0.5}
                    color={buttonTextColor}
                />
            </TouchableOpacity>
            {label && <Text style={[styles.label, { color: customTextColor || textColor }]}>
                {label}
            </Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        textAlign: 'center',
    },
    button: {
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: Spacing.xs,
        elevation: 3,
    },
    label: {
        marginTop: Spacing.xs,
        fontSize: Size.tiny,
        fontWeight: Weight.mediumWeight,
    },
}); 