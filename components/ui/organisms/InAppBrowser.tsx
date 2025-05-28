import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconSymbol } from '@/components/ui/atoms';

interface InAppBrowserProps {
    visible: boolean;
    onClose: () => void;
    url: string;
    onNavigationStateChange?: (navState: any) => void;
    disableDragClose?: boolean;
}

export function InAppBrowser({
    visible,
    onClose,
    url,
    onNavigationStateChange,
}: InAppBrowserProps) {
    const [isLoading, setIsLoading] = useState(true);
    const textColor = useThemeColor({}, 'text');

    if (!visible) return null;

    return (

        <View style={styles.overlay}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <IconSymbol name="xmark" size={24} color={textColor} />
                </TouchableOpacity>
            </View>
            {
                isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color={textColor} size="large" />
                    </View>
                )
            }
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
        </View >

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