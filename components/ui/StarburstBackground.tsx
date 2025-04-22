import React from 'react';
import Svg, { G, Path, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur } from 'react-native-svg';
import { StyleSheet, ViewStyle } from 'react-native';

interface StarburstBackgroundProps {
    primaryColor?: string;
    style?: ViewStyle;
    opacity?: number;
}

export function StarburstBackground({
    primaryColor = '#0080FF',
    style,
    opacity = 0.5
}: StarburstBackgroundProps) {
    return (
        <Svg
            width="402"
            height="874"
            viewBox="0 0 402 874"
            style={[styles.svg, style]}
        >
            <G filter="url(#filter0_f_9_280)">
                <G filter="url(#filter1_f_9_280)">
                    <Path d="M201 -612L271.23 81.7702L965 152L271.23 222.23L201 916L130.77 222.23L-563 152L130.77 81.7702L201 -612Z" fill={primaryColor} />
                </G>
                <G opacity={opacity} filter="url(#filter2_f_9_280)">
                    <Path d="M201 -373.631L249.318 103.682L726.632 152L249.318 200.319L201 677.632L152.682 200.319L-324.632 152L152.682 103.682L201 -373.631Z" fill={primaryColor} />
                </G>
                <G filter="url(#filter3_f_9_280)">
                    <Path d="M201 -196.384L218.244 134.756L549.384 152L218.244 169.244L201 500.384L183.756 169.244L-147.384 152L183.756 134.756L201 -196.384Z" fill={primaryColor} />
                </G>
                <G filter="url(#filter4_f_9_280)">
                    <Path d="M201 -196.384L205.927 147.073L549.384 152L205.927 156.927L201 500.384L196.073 156.927L-147.384 152L196.073 147.073L201 -196.384Z" fill={primaryColor} />
                </G>
            </G>
            <Defs>
                <Filter id="filter0_f_9_280" x="-643" y="-692" width="1688" height="1688" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="40" result="effect1_foregroundBlur_9_280" />
                </Filter>
                <Filter id="filter1_f_9_280" x="-1021.4" y="-1070.4" width="2444.8" height="2444.8" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="229.2" result="effect1_foregroundBlur_9_280" />
                </Filter>
                <Filter id="filter2_f_9_280" x="-446.872" y="-495.871" width="1295.74" height="1295.74" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="61.12" result="effect1_foregroundBlur_9_280" />
                </Filter>
                <Filter id="filter3_f_9_280" x="-177.944" y="-226.944" width="757.888" height="757.888" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="15.28" result="effect1_foregroundBlur_9_280" />
                </Filter>
                <Filter id="filter4_f_9_280" x="-152.014" y="-201.014" width="706.028" height="706.028" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="2.31515" result="effect1_foregroundBlur_9_280" />
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