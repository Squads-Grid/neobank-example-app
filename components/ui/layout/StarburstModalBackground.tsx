// import React from 'react';
// import Svg, { G, Path, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur, ClipPath, Rect } from 'react-native-svg';
// import { StyleSheet, ViewStyle } from 'react-native';

// interface StarburstModalBackgroundProps {
//     primaryColor?: string;
//     style?: ViewStyle;
// }

// export function StarburstModalBackground({
//     primaryColor = '#0080FF',
//     style
// }: StarburstModalBackgroundProps) {
//     return (
//         <Svg
//             width="100%"
//             height="100%"
//             viewBox="0 0 362 566"
//             style={[styles.svg, style]}
//         >
//             <G clipPath="url(#clip0_10_12)">
//                 <Rect width="362" height="566" rx="32" fill="black" />
//                 <G filter="url(#filter0_f_10_12)">
//                     <Path d="M181 6L235.511 544.489L774 599L235.511 653.511L181 1192L126.489 653.511L-412 599L126.489 544.489L181 6Z" fill={primaryColor} />
//                 </G>
//                 <G opacity="0.5" filter="url(#filter1_f_10_12)">
//                     <Path d="M181 191.016L218.504 561.497L588.984 599L218.504 636.504L181 1006.98L143.497 636.504L-226.984 599L143.497 561.497L181 191.016Z" fill={primaryColor} />
//                 </G>
//                 <G filter="url(#filter2_f_10_12)">
//                     <Path d="M181 328.592L184.824 595.176L451.408 599L184.824 602.824L181 869.408L177.176 602.824L-89.408 599L177.176 595.176L181 328.592Z" fill={primaryColor} />
//                 </G>
//             </G>
//             <Defs>
//                 <Filter id="filter0_f_10_12" x="-767.8" y="-349.8" width="1897.6" height="1897.6" filterUnits="userSpaceOnUse">
//                     <FeFlood floodOpacity="0" result="BackgroundImageFix" />
//                     <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//                     <FeGaussianBlur stdDeviation="177.9" result="effect1_foregroundBlur_10_12" />
//                 </Filter>
//                 <Filter id="filter1_f_10_12" x="-321.864" y="96.1363" width="1005.73" height="1005.73" filterUnits="userSpaceOnUse">
//                     <FeFlood floodOpacity="0" result="BackgroundImageFix" />
//                     <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//                     <FeGaussianBlur stdDeviation="47.44" result="effect1_foregroundBlur_10_12" />
//                 </Filter>
//                 <Filter id="filter2_f_10_12" x="-129.408" y="288.592" width="620.816" height="620.816" filterUnits="userSpaceOnUse">
//                     <FeFlood floodOpacity="0" result="BackgroundImageFix" />
//                     <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//                     <FeGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_10_12" />
//                 </Filter>
//                 <ClipPath id="clip0_10_12">
//                     <Rect width="362" height="566" rx="32" fill="white" />
//                 </ClipPath>
//             </Defs>
//         </Svg>
//     );
// }

// const styles = StyleSheet.create({
//     svg: {
//         position: 'absolute',
//         width: '100%',
//         height: '100%',
//     },
// }); 