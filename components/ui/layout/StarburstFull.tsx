import React from 'react';
import Svg, { G, Path, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur } from 'react-native-svg';
import { StyleSheet, ViewStyle } from 'react-native';

interface StarburstFullProps {
    primaryColor?: string;
    style?: ViewStyle;
    opacity?: number;
}

export function StarburstFull({
    primaryColor = '#00FF80',
    style,
    opacity = 0.5
}: StarburstFullProps) {
    return (
        <Svg
            width="402"
            height="874"
            viewBox="0 0 402 874"
            style={[styles.svg, style]}
        >
            <G filter="url(#filter0_f_35_1900)">
                <G filter="url(#filter1_f_35_1900)">
                    <Path d="M201 -132L253.305 384.695L770 437L253.305 489.305L201 1006L148.695 489.305L-368 437L148.695 384.695L201 -132Z" fill={primaryColor} />
                </G>
                <G opacity={opacity} filter="url(#filter2_f_35_1900)">
                    <Path d="M201 45.5283L236.986 401.015L592.472 437L236.986 472.986L201 828.472L165.014 472.986L-190.472 437L165.014 401.015L201 45.5283Z" fill={primaryColor} />
                </G>
                <G filter="url(#filter3_f_35_1900)">
                    <Path d="M201 177.536L213.843 424.157L460.464 437L213.843 449.843L201 696.464L188.157 449.843L-58.4641 437L188.157 424.157L201 177.536Z" fill={primaryColor} />
                </G>
                <G filter="url(#filter4_f_35_1900)">
                    <Path d="M201 177.536L204.669 433.331L460.464 437L204.669 440.67L201 696.464L197.331 440.67L-58.4641 437L197.331 433.331L201 177.536Z" fill={primaryColor} />
                </G>
            </G>
            <Defs>
                <Filter id="filter0_f_35_1900" x="-427.581" y="-191.581" width="1257.16" height="1257.16" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="29.7906" result="effect1_foregroundBlur_35_1900" />
                </Filter>
                <Filter id="filter1_f_35_1900" x="-709.4" y="-473.4" width="1820.8" height="1820.8" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="170.7" result="effect1_foregroundBlur_35_1900" />
                </Filter>
                <Filter id="filter2_f_35_1900" x="-281.512" y="-45.5117" width="965.024" height="965.024" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="45.52" result="effect1_foregroundBlur_35_1900" />
                </Filter>
                <Filter id="filter3_f_35_1900" x="-81.2241" y="154.776" width="564.448" height="564.448" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="11.38" result="effect1_foregroundBlur_35_1900" />
                </Filter>
                <Filter id="filter4_f_35_1900" x="-61.9126" y="174.088" width="525.825" height="525.825" filterUnits="userSpaceOnUse">
                    <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                    <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <FeGaussianBlur stdDeviation="1.72424" result="effect1_foregroundBlur_35_1900" />
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