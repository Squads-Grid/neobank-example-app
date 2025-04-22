import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Colors';
interface HeaderTextProps {
    title: string;
    subtitle?: string;
    flex?: number;
}

export function HeaderText({ title, subtitle, flex }: HeaderTextProps) {
    return (
        <View style={[styles.container, flex ? { flex } : {}]}>
            <ThemedText style={styles.title} type="title">{title}</ThemedText>
            {subtitle && <ThemedText style={styles.subtitle} type="default">{subtitle}</ThemedText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginTop: 60
    },
    title: {
        marginBottom: Spacing.sm,
        color: Colors.light.textOnColored
    },
    subtitle: {
        color: Colors.light.textOnColored
    }
}); 