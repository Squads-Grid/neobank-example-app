import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Height, Size, Weight } from '@/constants/Typography';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'highlight' | 'defaultSemiBold' | 'subtitle' | 'link' | 'jumbo' | 'regular' | 'regularSemiBold' | 'tiny' | 'large';
};

export function ThemedText({
    children,
    style,
    type = 'default',
    ...props
}: ThemedTextProps) {
    const { textColor } = useScreenTheme();

    return (
        <Text
            style={[
                { color: textColor },
                type === 'default' ? styles.default : undefined,
                type === 'highlight' ? styles.highlight : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'jumbo' ? styles.jumbo : undefined,
                type === 'regular' ? styles.regular : undefined,
                type === 'regularSemiBold' ? styles.regularSemiBold : undefined,
                type === 'tiny' ? styles.tiny : undefined,
                type === 'large' ? styles.large : undefined,
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    tiny: {
        fontSize: Size.tiny,
        fontWeight: Weight.mediumWeight,
        lineHeight: Size.tiny * Height.lineHeightTight,
    },
    regular: {
        fontSize: Size.regular,
        fontWeight: Weight.mediumWeight,
        lineHeight: Size.regular * Height.lineHeightMedium,

    },
    regularSemiBold: {
        fontSize: Size.regular,
        fontWeight: Weight.semiBoldWeight,
        lineHeight: Size.regular * Height.lineHeightNormal,
    },
    default: {
        fontSize: Size.medium,
        fontWeight: Weight.regularWeight,
        lineHeight: Size.medium * Height.lineHeightNormal,
    },
    defaultSemiBold: {
        fontSize: Size.medium,
        fontWeight: Weight.semiBoldWeight,
        lineHeight: Size.medium * Height.lineHeightMedium,
    },
    highlight: {
        fontSize: Size.giant,
        fontWeight: Weight.boldWeight,
        lineHeight: Size.giant * Height.lineHeightNormal,

    },
    large: {
        fontSize: Size.xlarge,
        fontWeight: Weight.semiBoldWeight,
        lineHeight: Size.xlarge * Height.lineHeightNormal,
    },
    jumbo: {
        fontSize: Size.jumbo,
        fontWeight: Weight.boldWeight,
        lineHeight: Size.jumbo * Height.lineHeightNormal,
    },
    subtitle: {
        fontSize: Size.large,
        fontWeight: Weight.semiBoldWeight,
    },
    link: {
        lineHeight: 30,
        fontSize: Size.medium,
        color: '#FFFFFF',
    },
});