import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';
import { Ionicons } from '@expo/vector-icons';
import { Weight } from '@/constants/Typography';

interface KeypadProps {
    onKeyPress: (key: string) => void;
}

export function Keypad({ onKeyPress }: KeypadProps) {
    const textColor = useThemeColor({}, 'text');

    const renderKey = (key: string) => (
        <TouchableOpacity
            key={key}
            style={styles.keyButton}
            onPress={() => onKeyPress(key)}
        >
            {key === 'backspace' ? (
                <Ionicons name="backspace-outline" size={24} color={textColor} />
            ) : (
                <Text style={[styles.keyText, { color: textColor }]}>{key}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.keypadContainer}>
            <View style={styles.keypadRow}>
                {renderKey('1')}
                {renderKey('2')}
                {renderKey('3')}
            </View>
            <View style={styles.keypadRow}>
                {renderKey('4')}
                {renderKey('5')}
                {renderKey('6')}
            </View>
            <View style={styles.keypadRow}>
                {renderKey('7')}
                {renderKey('8')}
                {renderKey('9')}
            </View>
            <View style={styles.keypadRow}>
                {renderKey('.')}
                {renderKey('0')}
                {renderKey('backspace')}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    keypadContainer: {
        width: '100%',
        padding: Spacing.sm,
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    keyButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: Spacing.sm,
        margin: Spacing.xxs,
    },
    keyText: {
        fontSize: 26,
        fontWeight: Weight.semiBoldWeight,
    },
}); 