import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import LoginForm from '@/components/LoginForm';
import { HeaderText } from '@/components/ui/HeaderText';
import { View } from 'react-native';

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
    <ScreenLayout>
      <HeaderText 
        title="Bright" 
        subtitle="Your finances, upgraded" 
        flex={0.3}
      />
      <LoginForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
      />
    </ScreenLayout>
  );
}
