import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface OverlappingImagesProps {
    leftImage: ImageSourcePropType;
    rightImage: ImageSourcePropType;
    size?: number;
    overlap?: number;
    borderWidth?: number;
    borderColor?: string;
    leftOnTop?: boolean;
    backdropOpacity?: number;
}

export function OverlappingImages({
    leftImage,
    rightImage,
    size = 40,
    overlap = 0.3, // 30% overlap by default
    borderWidth = 0,
    borderColor = 'white',
    leftOnTop = true,
    backdropOpacity = 1 // Default to full opacity
}: OverlappingImagesProps) {
    const overlapValue = size * overlap;

    // Set z-indexes based on which image should be on top
    const leftZIndex = leftOnTop ? 2 : 1;
    const rightZIndex = leftOnTop ? 1 : 2;

    // Set opacity based on which image is in the back
    const leftOpacity = leftOnTop ? 1 : backdropOpacity;
    const rightOpacity = leftOnTop ? backdropOpacity : 1;

    return (
        <View style={[styles.container, { width: size * 2 - overlapValue }]}>
            <View style={[
                styles.imageWrapper,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth,
                    borderColor,
                    zIndex: leftZIndex,
                    opacity: leftOpacity
                }
            ]}>
                <Image
                    source={leftImage}
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                    resizeMode="cover"
                />
            </View>

            <View style={[
                styles.imageWrapper,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth,
                    borderColor,
                    marginLeft: -overlapValue,
                    zIndex: rightZIndex,
                    opacity: rightOpacity
                }
            ]}>
                <Image
                    source={rightImage}
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                    resizeMode="cover"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageWrapper: {
        overflow: 'hidden',
    }
}); 