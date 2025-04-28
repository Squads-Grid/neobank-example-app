import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur, G } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface StarburstProps {
    style?: any;
}

export const Starburst: React.FC<StarburstProps> = ({ style }) => {
    // The cross center in the SVG is at (201, 152)
    const svgWidth = 402;
    const svgHeight = 874;
    const crossX = 201;
    const crossY = 152;
    const left = screenWidth / 2 - crossX;
    const top = screenHeight * 0.1 - crossY;

    return (
        <View style={[styles.container, { left, top, width: svgWidth, height: svgHeight }, style]} pointerEvents="none">
            <Svg width={svgWidth} height={svgHeight} viewBox="0 0 402 874" fill="none">
                <G filter="url(#filter0_f_9_281)">
                    <Path d="M201 40L241.171 436.829L638 477L241.171 517.171L201 914L160.829 517.171L-236 477L160.829 436.829L201 40Z" fill="#0080FF" />
                </G>
                <G opacity="0.5" filter="url(#filter1_f_9_281)">
                    <Path d="M201 176.344L228.638 449.363L501.656 477L228.638 504.638L201 777.656L173.363 504.638L-99.6559 477L173.363 449.363L201 176.344Z" fill="#0080FF" />
                </G>
                <G filter="url(#filter2_f_9_281)">
                    <Path d="M201 277.728L210.863 467.137L400.272 477L210.863 486.863L201 676.272L191.136 486.863L1.7279 477L191.136 467.137L201 277.728Z" fill="#0080FF" />
                </G>
                <G filter="url(#filter3_f_9_281)">
                    <Path d="M201 277.728L203.818 474.182L400.272 477L203.818 479.818L201 676.272L198.182 479.818L1.7279 477L198.182 474.182L201 277.728Z" fill="#0080FF" />
                </G>
                <Defs>
                    <Filter id="filter0_f_9_281" x="-498.2" y="-222.2" width="1398.4" height="1398.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <FeGaussianBlur stdDeviation="131.1" result="effect1_foregroundBlur_9_281" />
                    </Filter>
                    <Filter id="filter1_f_9_281" x="-169.576" y="106.424" width="741.152" height="741.152" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <FeGaussianBlur stdDeviation="34.96" result="effect1_foregroundBlur_9_281" />
                    </Filter>
                    <Filter id="filter2_f_9_281" x="-15.7521" y="260.248" width="433.504" height="433.504" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <FeGaussianBlur stdDeviation="8.74" result="effect1_foregroundBlur_9_281" />
                    </Filter>
                    <Filter id="filter3_f_9_281" x="-0.92058" y="275.08" width="403.841" height="403.841" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <FeGaussianBlur stdDeviation="1.32424" result="effect1_foregroundBlur_9_281" />
                    </Filter>
                </Defs>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
}); 