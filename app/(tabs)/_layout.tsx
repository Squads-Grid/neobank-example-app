import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { IconSymbol, HapticTab } from '@/components/ui/atoms';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <ProtectedRoute>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme as 'light' | 'dark'].icon,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarStyle: Platform.select({
                        ios: {
                            // Use a transparent background on iOS to show the blur effect
                            position: 'absolute',
                        },
                        default: {},
                    }),
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        headerShown: true,
                        headerTitle: 'Settings',
                        title: 'Settings',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
                    }}
                />
            </Tabs>
        </ProtectedRoute>
    );
}
