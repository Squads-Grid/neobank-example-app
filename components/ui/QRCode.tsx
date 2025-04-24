import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface StylizedQRCodeProps {
    value: string;
    size?: number;
    color?: string;
    backgroundColor?: string;
    ecl?: 'L' | 'M' | 'Q' | 'H';
}

export function QRCode({
    value,
    size = 280,
    color = 'white',
    backgroundColor = 'black',
    ecl = 'H'
}: StylizedQRCodeProps) {
    const positionMarkerSize = size * 0.18; // Size of position markers

    return (
        <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
            {/* Base QR Code */}
            <QRCode
                value={value}
                size={size * 0.9}
                color={color}
                backgroundColor={backgroundColor}
                ecl={ecl} // Error correction level - H is highest
            />

            {/* Custom Position Markers */}
            {/* Top Left */}
            <View style={[styles.positionMarker, { top: size * 0.05, left: size * 0.05, width: positionMarkerSize, height: positionMarkerSize }]}>
                <View style={[styles.positionOuterSquare, { borderColor: color }]}>
                    <View style={[styles.positionInnerSquare, { backgroundColor: color }]} />
                </View>
            </View>

            {/* Top Right */}
            <View style={[styles.positionMarker, { top: size * 0.05, right: size * 0.05, width: positionMarkerSize, height: positionMarkerSize }]}>
                <View style={[styles.positionOuterSquare, { borderColor: color }]}>
                    <View style={[styles.positionInnerSquare, { backgroundColor: color }]} />
                </View>
            </View>

            {/* Bottom Left */}
            <View style={[styles.positionMarker, { bottom: size * 0.05, left: size * 0.05, width: positionMarkerSize, height: positionMarkerSize }]}>
                <View style={[styles.positionOuterSquare, { borderColor: color }]}>
                    <View style={[styles.positionInnerSquare, { backgroundColor: color }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 12,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // For a gradient effect, install expo-linear-gradient
    },
    qrCodeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    positionMarker: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    positionOuterSquare: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    positionInnerSquare: {
        width: '50%',
        height: '50%',
        borderRadius: 6,
    },
    glowEffect: {
        position: 'absolute',
        zIndex: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowInner: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
    },
    glowCore: {
        width: '30%',
        height: '30%',
        backgroundColor: 'white',
        borderRadius: 100,
    }
});