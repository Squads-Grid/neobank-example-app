import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Spacing } from '@/constants/Spacing';

interface ChipProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function Chip({ children, style }: ChipProps) {
    const { textColor } = useScreenTheme();

    return (
        <View style={[styles.chip, style, { borderColor: textColor + 10 }]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        paddingVertical: Spacing.sm,
        paddingHorizontal: 14,
    },
}); 