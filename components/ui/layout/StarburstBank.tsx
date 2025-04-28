import React from 'react';
import Svg, { G, Path, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur } from 'react-native-svg';
import { StyleSheet, ViewStyle } from 'react-native';

interface StarburstBankProps {
    primaryColor?: string;
    style?: ViewStyle;
    opacity?: number;
}

export function StarburstBank({
    primaryColor = '#0080FF',
    style,
    opacity = 0.5
}: StarburstBankProps) {
    return (
        <Svg
            width="402"
            height="862"
            viewBox="0 0 402 862"
            style={[styles.svg, style]}
        >
            <G filter="url(#filter0_f_53_2504)">
                <Path d="M201 -680L255.511 -141.511L794 -87L255.511 -32.4891L201 506L146.489 -32.4891L-392 -87L146.489 -141.511L201 -680Z" fill={primaryColor} />
            </G>
            <G opacity={opacity} filter="url(#filter1_f_53_2504)">
                <Path d="M201 -494.984L238.504 -124.503L608.984 -86.9996L238.504 -49.4962L201 320.984L163.497 -49.4962L-206.984 -86.9996L163.497 -124.503L201 -494.984Z" fill={primaryColor} />
            </G>
            <G filter="url(#filter2_f_53_2504)">
                <Path d="M201 -357.408L204.824 -90.8241L471.408 -87L204.824 -83.1758L201 183.408L197.176 -83.1758L-69.408 -87L197.176 -90.8241L201 -357.408Z" fill={primaryColor} />
            </G>
            <Defs>
                <Filter id="filter0_f_53_2504" x="-747.8" y="-1035.8" width="1897.6" height="1897.6" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="177.9" result="effect1_foregroundBlur_53_2504" />
                </Filter>
                <Filter id="filter1_f_53_2504" x="-301.864" y="-589.864" width="1005.73" height="1005.73" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="47.44" result="effect1_foregroundBlur_53_2504" />
                </Filter>
                <Filter id="filter2_f_53_2504" x="-109.408" y="-397.408" width="620.816" height="620.816" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_53_2504" />
                </Filter>
            </Defs>
        </Svg>
    );
}

const styles = StyleSheet.create({
    svg: {
        position: 'absolute',
        left: '0%',
        top: '-10%',
    },
});