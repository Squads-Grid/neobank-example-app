import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import tinycolor from 'tinycolor2';
import { Spacing } from '@/constants/Spacing';

interface DashedDividerProps {
    style?: ViewStyle;
    color?: string;
    thickness?: number;
    dashLength?: number;
    dashGap?: number;
}

export function DashedDivider({
    style,
    color,
    thickness = 1,
    dashLength = 8, // Length of each dash
    dashGap = 8     // Gap between dashes
}: DashedDividerProps) {
    const { textColor } = useScreenTheme();
    const [width, setWidth] = useState(0);

    // Default color: semi-transparent text color
    const dividerColor = color || tinycolor(textColor).setAlpha(0.2).toRgbString();

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width);
    }, []);

    const dashStyle = {
        width: dashLength,
        height: thickness,
        backgroundColor: dividerColor,
        marginRight: dashGap, // Add gap to the right of each dash
    };

    const numberOfDashes = Math.floor(width / (dashLength + dashGap));

    return (
        // Container gets the layout and applies passed styles
        <View
            onLayout={onLayout}
            style={[styles.container, { height: thickness }, style]}
            // Ensure layout measurement happens even if no background/border
            collapsable={false}
        >
            {width > 0 && (
                <View style={styles.dashContainer}>
                    {Array.from({ length: numberOfDashes }, (_, i) => (
                        <View key={i} style={dashStyle} />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: Spacing.lg
    },
    dashContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
}); 