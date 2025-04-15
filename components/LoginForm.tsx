import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { Spacing } from '@/constants/Spacing';

interface LoginFormProps {
  onSubmit: (email: string, code?: string) => void;
  isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setShowCodeInput(true);
      onSubmit(email);
    }
  };

  const handleCodeSubmit = () => {
    if (code.trim()) {
      onSubmit(email, code);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ThemedView style={styles.form}>
          {!showCodeInput ? (
            <>
              <ThemedText style={styles.title} type="defaultSemiBold">
                Enter your email to sign in
              </ThemedText>
              <ThemedTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
              />
              <ThemedButton
                title="Continue"
                onPress={handleEmailSubmit}
                disabled={!email.trim() || isLoading}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <ThemedText style={styles.title} type="defaultSemiBold">
                Enter the verification code
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                We sent a code to {email}
              </ThemedText>
              <ThemedTextInput
                placeholder="Verification code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={styles.input}
              />
              <ThemedButton
                title="Verify"
                onPress={handleCodeSubmit}
                disabled={!code.trim() || isLoading}
                style={styles.button}
              />
              <ThemedButton
                title="Back"
                variant="outline"
                onPress={() => setShowCodeInput(false)}
                style={styles.button}
              />
            </>
          )}
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  input: {
    marginBottom: Spacing.lg,
  },
  button: {
    marginTop: Spacing.md,
  },
}); 