import { Stack } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { AppIcon } from '@/components/ui/AppIcon';
import { Spacing } from '@/constants/Spacing';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SendLayout() {
    const textColor = useThemeColor({}, 'text');
    const primaryColor = useThemeColor({}, 'primary');

    const getHeaderTitle = (title: string) => {
        return (
            <View style={styles.headerStyle}>
                <ThemedScreenText type="defaultSemiBold" style={styles.headerTitle}>
                    {title}
                </ThemedScreenText>
                <AppIcon name="sent" size={24} />
            </View>
        )
    }

    const renderBackButton = () => {
        return (
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                headerBackVisible: true,
                headerLeft: () => renderBackButton(),
            }}
        >
            <Stack.Screen
                name="amount"
                options={{
                    title: '',
                    headerTitle: () => getHeaderTitle('Send'),
                }}
            />
            <Stack.Screen
                name="confirm"
                options={{
                    title: '',
                    headerTitle: () => getHeaderTitle('Confirm'),
                }}
            />
            {/*
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
    },
    backButton: {
        padding: Spacing.xs,
    }
});
