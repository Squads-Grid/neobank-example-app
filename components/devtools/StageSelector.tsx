import React, { useState } from 'react';
import { View, StyleSheet, Switch, Text } from 'react-native';
import { ThemedText } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { useScreenTheme } from '@/contexts/ScreenThemeContext';

/**
 * Stage types for the demo app
 * This is for development and demo purposes only
 * Controls the app flow without needing to reset the app state
 */
export type Stage = 'new' | 'kyc' | 'finished';

interface StageSelectorProps {
    onStageChange: (stage: Stage) => void;
    initialStage?: Stage;
}

/**
 * StageSelector - DEVELOPER TOOL
 * This component allows developers and demo users to control the app state
 * by switching between different account stages without having to complete the actual flow.
 */
export function StageSelector({ onStageChange, initialStage = 'new' }: StageSelectorProps) {
    const [selectedStage, setSelectedStage] = useState<Stage>(initialStage);
    const { textColor } = useScreenTheme();

    const handleStageChange = (stage: Stage) => {
        if (stage !== selectedStage) {
            setSelectedStage(stage);
            onStageChange(stage);
        }
    };

    const isSelected = (stage: Stage) => selectedStage === stage;

    return (
        <View style={styles.container}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
                Account Stage <Text style={styles.demoTag}>(DEMO ONLY)</Text>
            </ThemedText>
            <ThemedText type="tiny" style={styles.description}>
                For development and demonstration purposes only.
                Controls the banking flow without needing to reset app state.
            </ThemedText>

            <View style={styles.optionsContainer}>
                <View style={styles.option}>
                    <ThemedText>New</ThemedText>
                    <Switch
                        value={isSelected('new')}
                        onValueChange={() => handleStageChange('new')}
                        trackColor={{ false: '#767577', true: textColor }}
                        thumbColor={'#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                    />
                </View>

                <View style={styles.option}>
                    <ThemedText>KYC</ThemedText>
                    <Switch
                        value={isSelected('kyc')}
                        onValueChange={() => handleStageChange('kyc')}
                        trackColor={{ false: '#767577', true: textColor }}
                        thumbColor={'#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                    />
                </View>

                <View style={styles.option}>
                    <ThemedText>Finished</ThemedText>
                    <Switch
                        value={isSelected('finished')}
                        onValueChange={() => handleStageChange('finished')}
                        trackColor={{ false: '#767577', true: textColor }}
                        thumbColor={'#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.lg,
        width: '100%',
    },
    title: {
        marginBottom: Spacing.xs,
    },
    demoTag: {
        fontSize: 10,
        color: '#FF6B6B',
        fontWeight: 'bold',
    },
    description: {
        marginBottom: Spacing.md,
        opacity: 0.6,
    },
    optionsContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
}); 