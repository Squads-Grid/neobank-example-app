import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { LoginForm } from '@/components/LoginForm';
import { ScreenHeaderText } from '@/components/ui/ScreenHeaderText';
import { Image, StyleSheet, View } from 'react-native';

import { withScreenTheme } from '@/components/withScreenTheme';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { ThemedScreenText } from '@/components/ui/ThemedScreenText';
import { ThemedScreenButton } from '@/components/ui/ThemedScreenButton';

// Require the new image - ADJUST PATH IF NEEDED
const starburstTopImage = require('@/assets/images/starburst-top.png');

const FIXED_BACKGROUND_COLOR = '#000000';

function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSubmit = async (email: string, code?: string) => {
        try {
            setIsLoading(true);
            if (code) {
                await signIn(email, code);
            } else {
                // Here you would typically send the verification code to the user's email
                console.log('Sending verification code to:', email);
                // Simulate verification delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedScreen>
            {/* Background Image - Top */}
            <Image
                source={starburstTopImage}
                style={styles.backgroundImage}
                resizeMode="cover" // Adjust as needed
            />

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Wrap HeaderText to apply flex style */}
                <View style={styles.headerContainer}>
                    <ScreenHeaderText
                        title="Bright"
                        subtitle="Your finances, upgraded"
                    />
                </View>
                <LoginForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
                <View />
            </View>
        </ThemedScreen>
    );
}

export default withScreenTheme(LoginScreen, {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    primaryColor: '#FFFFFF'
});

// Add StyleSheet
const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        left: '-18%',
        top: '-10%',
        width: '150%',
        height: '150%',
    },
    contentContainer: {
        flex: 1, // Take up all space within ScreenLayout
        zIndex: 1, // Ensure content is above the background image
        // Add padding here if ScreenLayout's padding isn't desired
        // Or use flex properties to arrange children
    },
    // New container for header text styling
    headerContainer: {
        flex: 0.4, // Apply flex here
        justifyContent: 'flex-start', // Center content vertically within the flex space
        alignItems: 'center', // Center content horizontally within the flex space
    },
});
