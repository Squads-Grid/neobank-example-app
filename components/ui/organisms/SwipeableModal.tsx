import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View, ViewStyle } from 'react-native';

interface SwipeableModalProps {
    children: React.ReactNode;
    onDismiss: () => void;
    style?: ViewStyle;
    pullIndicatorColor?: string;
    showPullIndicator?: boolean;
}

export function SwipeableModal({
    children,
    onDismiss,
    style,
    pullIndicatorColor = 'rgba(255, 255, 255, 0.3)',
    showPullIndicator = true,
}: SwipeableModalProps) {
    // Animation value for dismissal gesture
    const pan = useRef(new Animated.ValueXY()).current;

    // Create the pan responder
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only respond to vertical gestures
                return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
            },
            onPanResponderMove: (_, gestureState) => {
                // Follow the gesture - only allow downward movement
                if (gestureState.dy > 0) {
                    pan.y.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // If swiped down with enough velocity or distance, dismiss
                if (gestureState.dy > 150 || (gestureState.vy > 0.5 && gestureState.dy > 50)) {
                    onDismiss();
                } else {
                    // Otherwise bounce back
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <Animated.View
            style={[
                styles.modalContainer,
                style,
                { transform: [{ translateY: pan.y }] },
            ]}
            {...panResponder.panHandlers}
        >
            {showPullIndicator && (
                <View style={[styles.pullIndicator, { backgroundColor: pullIndicatorColor }]} />
            )}
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    pullIndicator: {
        width: 40,
        height: 5,
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
}); 