import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface ThemedTextInputProps extends TextInputProps {
  error?: boolean;
}

export default function ThemedTextInput({ style, error, ...props }: ThemedTextInputProps) {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: error ? colors.notification : colors.border,
          color: colors.text,
          backgroundColor: colors.card,
        },
        style,
      ]}
      placeholderTextColor={colors.text + '80'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
}); 