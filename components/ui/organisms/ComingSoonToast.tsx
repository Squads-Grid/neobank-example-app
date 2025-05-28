import React, { useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { ThemedText, IconSymbol } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';

interface ComingSoonToastProps {
    visible: boolean;
    onHide: () => void;
    message?: string;
    duration?: number;
}

export function ComingSoonToast({
    visible,
    onHide,
    message = "Coming soon to your region!",
    duration = 3000
}: ComingSoonToastProps) {
    const { textColor, backgroundColor } = useScreenTheme();
    const translateY = new Animated.Value(100);
    const opacity = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            // Show toast
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Hide toast after duration
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    onHide();
                });
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor,
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <View style={styles.content}>
                <IconSymbol
                    name="clock"
                    size={20}
                    color={textColor}
                    style={styles.icon}
                />
                <ThemedText type="regular" style={styles.message}>
                    {message}
                </ThemedText>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Spacing.xxl,
        left: Spacing.lg,
        right: Spacing.lg,
        borderRadius: 12,
        padding: Spacing.md,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: Spacing.sm,
    },
    message: {
        textAlign: 'center',
    },
}); 