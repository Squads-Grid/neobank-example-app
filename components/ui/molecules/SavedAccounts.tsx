import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, IconSymbol } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ExternalAccountMapping } from '@/types/Transaction';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { StorageService } from '@/utils/storage';

interface SavedAccountsProps {
    onAddNew: () => void;
    onSelect: (accountId: string) => void;
}

export const SavedAccounts: React.FC<SavedAccountsProps> = ({ onAddNew, onSelect }) => {
    const [accounts, setAccounts] = useState<ExternalAccountMapping[]>([]);
    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'background');

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const storage = await StorageService.getItem(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS) as string;
            if (storage) {
                const parsedStorage = JSON.parse(storage);
                setAccounts(parsedStorage.accounts || []);
            }
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    };

    if (accounts.length === 0) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
                    <IconSymbol name="plus" size={20} color={textColor} />
                    <ThemedText type="regular">Add New Account</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="regular" style={{ color: textColor + '40' }}>Saved Accounts</ThemedText>
                <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
                    <IconSymbol name="plus" size={20} color={textColor} />
                    <ThemedText type="regular">Add New</ThemedText>
                </TouchableOpacity>
            </View>
            <View style={styles.accountsList}>
                {accounts.map((account) => (
                    <TouchableOpacity
                        key={account.external_account_id}
                        style={[styles.accountItem, { backgroundColor }]}
                        onPress={() => onSelect(account.external_account_id)}
                    >
                        <View style={styles.accountInfo}>
                            <ThemedText type="default">{account.label}</ThemedText>
                            <ThemedText type="regular" style={{ color: textColor + '40' }}>
                                Account ID: {account.external_account_id.slice(-4)}
                            </ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={textColor + '40'} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        padding: Spacing.sm,
    },
    accountsList: {
        gap: Spacing.sm,
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    accountInfo: {
        gap: Spacing.xs,
    },
}); 