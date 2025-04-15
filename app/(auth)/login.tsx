import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const { setEmail: setAuthEmail, verifyCode } = useAuth();
  const { colors } = useTheme();

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome</Text>
          
          {!showCodeInput ? (
            <>
              <Text style={[styles.subtitle, { color: colors.text }]}>Enter your email to sign in</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.card 
                }]}
                placeholder="Email"
                placeholderTextColor={colors.text + '80'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: colors.primary }]} 
                onPress={handleEmailSubmit}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.subtitle, { color: colors.text }]}>Enter the verification code sent to {email}</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: colors.card 
                }]}
                placeholder="Verification code"
                placeholderTextColor={colors.text + '80'}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: colors.primary }]} 
                onPress={handleCodeSubmit}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 