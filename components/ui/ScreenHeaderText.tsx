import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedScreenText } from './ThemedScreenText';
import { Spacing } from '@/constants/Spacing';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';

interface ScreenHeaderTextProps {
    title: string;
    subtitle?: string;
    flex?: number;
}

export function ScreenHeaderText({ title, subtitle, flex }: ScreenHeaderTextProps) {
    const { textColor } = useScreenTheme();

    return (
        <View style={[styles.container, flex ? { flex } : {}]}>
            <ThemedScreenText
                style={[styles.title, { color: textColor }]}
                type="title"
            >
                {title}
            </ThemedScreenText>
            {subtitle && (
                <ThemedScreenText
                    style={[styles.subtitle, { color: textColor }]}
                    type="default"
                >
                    {subtitle}
                </ThemedScreenText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginTop: 60
    },
    title: {
        marginBottom: Spacing.sm,
    },
    subtitle: {
        // Additional styling if needed
    }
}); 