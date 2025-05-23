import React, { useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform, ActivityIndicator, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { WebView } from 'react-native-webview';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconSymbol } from '@/components/ui/atoms';

interface InAppBrowserProps {
    visible: boolean;
    onClose: () => void;
    url: string;
    onNavigationStateChange?: (navState: any) => void;
}

export function InAppBrowser({ visible, onClose, url, onNavigationStateChange }: InAppBrowserProps) {
    const { height } = Dimensions.get('window');
    const [isLoading, setIsLoading] = useState(true);
    const textColor = useThemeColor({}, 'text');
    const pan = useRef(new Animated.ValueXY()).current;
    const backdropOpacity = useRef(new Animated.Value(1)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    pan.y.setValue(gestureState.dy);
                    backdropOpacity.setValue(1 - (gestureState.dy / height));
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 150 || (gestureState.vy > 0.5 && gestureState.dy > 50)) {
                    onClose();
                } else {
                    Animated.parallel([
                        Animated.spring(pan, {
                            toValue: { x: 0, y: 0 },
                            useNativeDriver: true,
                        }),
                        Animated.timing(backdropOpacity, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        })
                    ]).start();
                }
            },
        })
    ).current;

    if (!visible) return null;

    return (
        <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={onClose}
                activeOpacity={1}
            />
            <Animated.View
                style={[
                    styles.webviewContainer,
                    {
                        height: height - 60,
                        transform: [{ translateY: pan.y }]
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <View style={styles.pullIndicator} />
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color={textColor} size="large" />
                    </View>
                )}
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    onNavigationStateChange={onNavigationStateChange}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowFileAccess={true}
                    allowFileAccessFromFileURLs={true}
                    allowUniversalAccessFromFileURLs={true}
                    androidHardwareAccelerationDisabled={false}
                    androidLayerType="hardware"
                />
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: Spacing.lg,
        backgroundColor: 'white',
    },
    closeButton: {
        padding: Spacing.sm,
    },
    webviewContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    pullIndicator: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
}); 