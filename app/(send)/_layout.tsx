import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Spacing } from '@/constants/Spacing';

export default function SendLayout() {
    const textColor = useThemeColor({}, 'text');

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                headerBackTitle: 'Back',
                headerTintColor: textColor,
            }}
        >
            <Stack.Screen
                name="amount"
                options={{
                    title: '',
                    headerTitle: () => (
                        <View style={styles.headerStyle}>
                            <ThemedScreenText type="defaultSemiBold" style={styles.headerTitle}>
                                Send
                            </ThemedScreenText>
                            <AppIcon name="sent" size={24} />
                        </View>
                    ),
                }}
            />
            {/* <Stack.Screen
                name="confirm"
                options={{
                    title: 'Confirm',
                }}
            />
            <Stack.Screen
                name="success"
                options={{
                    title: 'Success',
                    headerBackVisible: false,
                }}
            /> */}
        </Stack>
    );
}

const styles = StyleSheet.create({
    headerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        marginRight: Spacing.sm
    }
});
