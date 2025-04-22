import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { ThemedView, ThemedViewProps } from '@/components/ui/ThemedView';
import { Spacing } from '@/constants/Spacing';
import { ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

// Extend ViewProps and add the color props
export type ScreenLayoutProps = ViewProps & {
    children: React.ReactNode;
    lightColor?: string;
    darkColor?: string;
};

export function ScreenLayout({
    children,
    style,
    lightColor,
    darkColor,
    ...rest
}: ScreenLayoutProps) {
    const effectiveBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        'background'
    );
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: effectiveBackgroundColor }]}>
            <ThemedView
                style={[styles.container, style]}
                lightColor={effectiveBackgroundColor}
                darkColor={effectiveBackgroundColor}
                {...rest}
            >
                {children}
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: Spacing.lg,
    },
}); 