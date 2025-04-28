import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Spacing } from '@/constants/Spacing';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';
import { Size, Weight } from '@/constants/Typography';

interface ScreenVerificationCodeInputProps {
    onCodeComplete: (code: string) => void;
}

export function ScreenVerificationCodeInput({ onCodeComplete }: ScreenVerificationCodeInputProps) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const { textColor, backgroundColor } = useScreenTheme();

    const isBackgroundDark = backgroundColor === '#000000' || backgroundColor.toLowerCase() === '#000';
    const inputBackgroundColor = isBackgroundDark ? '#FFFFFF' : '#000000';

    const handleChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto-focus next input
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if all fields are filled
        if (newCode.every(digit => digit !== '') && index === 5) {
            onCodeComplete(newCode.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {code.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={ref => {
                        inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={text => handleChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={[
                        styles.input,
                        {
                            backgroundColor: inputBackgroundColor + '40',
                            borderColor: textColor + '20',
                            color: textColor,
                        }
                    ]}
                    textAlign="center"
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    input: {
        fontSize: Size.xlarge,
        fontWeight: Weight.semiBoldWeight,
        width: 45,
        height: 45,
        borderRadius: 12,
        textAlign: 'center',
        borderWidth: 1,
    },
}); 