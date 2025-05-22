import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Spacing } from '@/constants/Spacing';

interface InAppBrowserProps {
    visible: boolean;
    onClose: () => void;
    url: string;
    onNavigationStateChange?: (navState: any) => void;
}

export function InAppBrowser({ visible, onClose, url, onNavigationStateChange }: InAppBrowserProps) {
    const { height } = Dimensions.get('window');

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            {/* <BlurView intensity={Platform.OS === 'ios' ? 50 : 100} style={styles.blur}> */}
            <View style={[styles.webviewContainer, { height: height - 60 }]}>
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    onNavigationStateChange={onNavigationStateChange}
                />
            </View>
            {/* </BlurView> */}
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    blur: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: Spacing.lg,
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
}); 