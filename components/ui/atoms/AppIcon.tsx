import React from 'react';
import { Image, ImageStyle } from 'react-native';

// Icon names mapping
const ICONS = {
    sent: require('@/assets/icons/sent.png'),
    'money-added': require('@/assets/icons/money-added.png'),
    // Add more icons as needed
};

export type IconName = keyof typeof ICONS;

export interface AppIconProps {
    name: IconName;
    size?: number;
    style?: ImageStyle;
    // Note: For PNG we can't dynamically change colors
}

/**
 * AppIcon is a unified component for rendering PNG icons
 * 
 * Usage:
 * <AppIcon name="dot" size={24} />
 * 
 * To add new icons:
 * 1. Place the PNG file in assets/icons/ directory
 * 2. Add it to the ICONS mapping with a descriptive name
 */
export function AppIcon({ name, size = 24, style }: AppIconProps) {
    // Ensure the name is a valid key in the ICONS object
    if (!(name in ICONS)) {
        console.warn(`Icon "${name}" not found in the ICONS mapping`);
        return null;
    }

    return (
        <Image
            source={ICONS[name]}
            style={[
                {
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                },
                style,
            ]}
        />
    );
} 