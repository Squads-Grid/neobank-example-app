import { Stack } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText, AppIcon } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SendLayout() {
    const textColor = useThemeColor({}, 'text');

    const getHeaderTitle = (title: string) => {
        return (
            <View style={styles.headerStyle}>
                <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
                    {title}
                </ThemedText>
                <AppIcon name="sent" size={24} />
            </View>
        )
    }

    const renderBackButton = () => {
        return (
            <TouchableOpacity
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>
        );
    };

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                headerBackTitle: 'Back',
                headerTintColor: textColor,
                headerBackVisible: false,
                headerLeft: () => renderBackButton(),
            }}
        >
            <Stack.Screen
                name="amount"
                options={{
                    title: '',
                    headerTitle: () => getHeaderTitle('Send Crypto'),
                }}
            />
            <Stack.Screen
                name="fiatamount"
                options={{
                    title: '',
                    headerTitle: () => getHeaderTitle('Send Fiat'),
                }}
            />
            <Stack.Screen
                name="confirm"
                options={{
                    title: '',
                    headerTitle: () => getHeaderTitle('Confirm Crypto Transfer'),
                }}
            />
            <Stack.Screen
                name="fiatconfirm"
                options={{
                    title: '',
                    headerTitle: () => getHeaderTitle('Confirm Fiat Transfer'),
                }}
            />
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
