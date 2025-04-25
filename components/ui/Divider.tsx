import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import tinycolor from 'tinycolor2';
import { Spacing } from '@/constants/Spacing';

type DividerType = 'dashed' | 'dotted' | 'solid';

interface DashedDividerProps {
    style?: ViewStyle;
    color?: string;
    thickness?: number;
    dashLength?: number;
    dashGap?: number;
    type?: DividerType;
}

export function Divider({
    style,
    color,
    thickness = 1,
    dashLength = 8, // Length of each dash
    dashGap = 8,    // Gap between dashes
    type = 'dashed' // Default to dashed
}: DashedDividerProps) {
    const { textColor } = useScreenTheme();
    const [width, setWidth] = useState(0);

    // Default color: semi-transparent text color
    const dividerColor = color || tinycolor(textColor).setAlpha(0.2).toRgbString();

    const onLayout = useCallback((event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width);
    }, []);

    // Calculate styles based on type
    const itemStyle = {
        backgroundColor: dividerColor,
        marginRight: dashGap, // Add gap to the right of each element
        ...(type === 'dotted'
            ? { width: thickness * 2, height: thickness * 2, borderRadius: thickness } // Make dots round
            : { width: dashLength, height: thickness }) // Dashes are rectangular
    };

    // If solid, don't create multiple elements
    if (type === 'solid') {
        return (
            <View
                style={[
                    styles.container,
                    {
                        height: thickness,
                        backgroundColor: dividerColor
                    },
                    style
                ]}
            />
        );
    }

    // For dashed and dotted, calculate number of items
    const spacing = type === 'dotted' ? thickness * 2 + dashGap : dashLength + dashGap;
    const numberOfItems = Math.floor(width / spacing);

    return (
        // Container gets the layout and applies passed styles
        <View
            onLayout={onLayout}
            style={[styles.container, { height: type === 'dotted' ? thickness * 2 : thickness }, style]}
            collapsable={false}
        >
            {width > 0 && (
                <View style={styles.dashContainer}>
                    {Array.from({ length: numberOfItems }, (_, i) => (
                        <View key={i} style={itemStyle} />
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