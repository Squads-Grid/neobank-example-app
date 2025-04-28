import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/atoms';
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
            <ThemedText
                style={[styles.title, { color: textColor }]}
                type="highlight"
            >
                {title}
            </ThemedText>
            {subtitle && (
                <ThemedText
                    style={{ color: textColor }}
                    type="default"
                >
                    {subtitle}
                </ThemedText>
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
}); 