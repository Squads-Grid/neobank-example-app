import { SafeAreaView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/atoms';
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
        { light: lightColor, dark: darkColor }, // Pass potential overrides
        'background' // Default semantic name if no overrides match the theme
    );
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: lightColor }]}>
            <ThemedView
                style={[styles.container, style]}
                lightColor={lightColor}
                darkColor={darkColor}
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