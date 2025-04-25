import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface OverlappingImagesProps {
    leftImage: ImageSourcePropType;
    rightImage: ImageSourcePropType;
    size?: number;
    overlap?: number;
    borderWidth?: number;
    borderColor?: string;
}

export function OverlappingImages({
    leftImage,
    rightImage,
    size = 40,
    overlap = 0.3, // 30% overlap by default
    borderWidth = 0,
    borderColor = 'white'
}: OverlappingImagesProps) {
    const overlapValue = size * overlap;

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
                    zIndex: 2
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
                    zIndex: 1
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