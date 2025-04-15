import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { VerificationCodeInput } from '@/components/ui/VerificationCodeInput';
import { Spacing } from '@/constants/Spacing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LoginFormProps {
  onSubmit: (email: string, code?: string) => void;
  isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setShowCodeInput(true);
      onSubmit(email);
    }
  };

  const handleCodeComplete = (completeCode: string) => {
    onSubmit(email, completeCode);
  };

  return (
    <SafeAreaView>
      {isLoading ? <LoadingSpinner />:<KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView>
          {!showCodeInput ? (
            <>
              <ThemedTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={{marginBottom: Spacing.md}}
              />
              <ThemedButton
                title="Continue"
                onPress={handleEmailSubmit}
                disabled={!email.trim() || isLoading}
              />
            </>
          ) : (
            <>
              <ThemedText type="defaultSemiBold" style={{textAlign: 'center', marginBottom: Spacing.lg, maxWidth: 300, alignSelf: 'center'}}>
                Enter the code we sent to {email}
              </ThemedText>
              <VerificationCodeInput onCodeComplete={handleCodeComplete} />
              <ThemedButton
                title="Back"
                variant="outline"
                onPress={() => setShowCodeInput(false)}
                
              />
            </>
          )}
        </ThemedView>
      </KeyboardAvoidingView>}
    </SafeAreaView>
  );
}