import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import ThemedTextInput from '../../components/ThemedTextInput';
import ThemedButton from '../../components/ThemedButton';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Spacing } from '@/constants/Spacing';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const { setEmail: setAuthEmail, verifyCode } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');

  const handleEmailSubmit = async () => {
    // TODO: Implement actual email sending logic with your backend
    setAuthEmail(email);
    setShowCodeInput(true);
  };

  const handleCodeSubmit = async () => {
    const success = await verifyCode(code);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title">Welcome</ThemedText>
          
          {!showCodeInput ? (
            <>
              <ThemedText style={{ marginBottom: Spacing.xl }} type="defaultSemiBold">Enter your email to sign in</ThemedText>
              <ThemedTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: Spacing.md }}
              />
              <ThemedButton
                title="Continue"
                onPress={handleEmailSubmit}
                disabled={!email}
              />
            </>
          ) : (
            <>
              <ThemedText style={{ marginBottom: Spacing.xl }} type="defaultSemiBold">Enter the verification code sent to {email}</ThemedText>
              <ThemedTextInput
                placeholder="Verification code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={{ marginBottom: Spacing.md }}
              />
              <ThemedButton
                title="Verify"
                onPress={handleCodeSubmit}
                disabled={!code}
              />
            </>
          )}
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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