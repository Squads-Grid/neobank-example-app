import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';

export type ThemedScreenTextProps = TextProps & {
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedScreenText({
    children,
    style,
    type = 'default',
    ...props
}: ThemedScreenTextProps) {
    const { textColor } = useScreenTheme();

    return (
        <Text
            style={[
                { color: textColor },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 56,
        fontWeight: 'bold',
        lineHeight: 56,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#FFFFFF',
    },
});