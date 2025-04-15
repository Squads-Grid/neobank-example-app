import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import ThemedView from '@/components/ui/ThemedView';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
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
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 