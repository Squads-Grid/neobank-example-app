import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@react-navigation/native';
import { lightTheme, darkTheme } from '@/constants/Theme';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from './(auth)/login';
import StartScreen from './(auth)/start';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    if (isAuthenticated !== null) {
      console.log('isAuthenticated', isAuthenticated);
      setIsReady(true);
    }
  }, [isAuthenticated]);

  // Don't render anything until we're ready
  if (!isReady) {
    return <LoadingSpinner />;
  }

  if(isAuthenticated){
    return (<Stack
      initialRouteName={isAuthenticated === true ? '(tabs)' : '(auth)'}
      screenOptions={{ headerShown: false }}
    > 
        <Stack.Screen name="(tabs)" />
      
    </Stack>)
  }else{
    return (
      <StartScreen />
    )
  }
  
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? darkTheme : lightTheme}>
        <RootLayoutNav />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}
