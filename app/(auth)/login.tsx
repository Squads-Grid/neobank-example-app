import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/ScreenLayout';

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
    <ScreenLayout>
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 