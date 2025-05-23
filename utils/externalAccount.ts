import * as SecureStore from 'expo-secure-store';
import { AUTH_STORAGE_KEYS } from './auth';
import { ExternalAccountMapping, ExternalAccountStorage } from '@/types/Transaction';

export const storeExternalAccount = async (gridUserId: string, externalAccountId: string, label: string) => {
    try {
        // Get existing storage
        const existingStorage = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
        console.log("🚀 ~ storeExternalAccount ~ existingStorage:", existingStorage)
        let storage: ExternalAccountStorage;
        let alreadyExists = false;

        if (existingStorage) {
            storage = JSON.parse(existingStorage);
            console.log("🚀 ~ storeExternalAccount ~ storage:", storage)
            // Remove any existing mapping for this grid_user_id
            storage.accounts = storage.accounts.filter(acc => acc.grid_user_id !== gridUserId);
            alreadyExists = storage.accounts.some(acc => acc.external_account_id === externalAccountId);
        } else {
            storage = { accounts: [] };
        }

        if (!alreadyExists) {
            // Add new mapping
            storage.accounts.push({
                grid_user_id: gridUserId,
                external_account_id: externalAccountId,
                label
            });
        }

        // Save updated storage
        await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS, JSON.stringify(storage));
    } catch (error) {
        console.error('Error storing external account:', error);
        throw error;
    }
};

export const getExternalAccountId = async (gridUserId: string): Promise<string | null> => {
    try {
        const storage = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
        console.log("🚀 ~ getExternalAccountId ~ storage:", storage)
        if (!storage) return null;

        const parsedStorage: ExternalAccountStorage = JSON.parse(storage);
        const mapping = parsedStorage.accounts.find(acc => acc.grid_user_id === gridUserId);
        return mapping?.external_account_id || null;
    } catch (error) {
        console.error('Error getting external account:', error);
        return null;
    }
};

export const getExternalAccountIds = async (): Promise<ExternalAccountStorage | null> => {
    try {
        const storage = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
        console.log("🚀 ~ getExternalAccountIds ~ storage:", storage)
        if (!storage) return null;

        const parsedStorage: ExternalAccountStorage = JSON.parse(storage);
        console.log("🚀 ~ getExternalAccountIds ~ parsedStorage:", parsedStorage)
        return parsedStorage;
    } catch (error) {
        console.error('Error getting external account:', error);
        return null;
    }
};

export const clearExternalAccounts = async () => {
    try {
        await SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
    } catch (error) {
        console.error('Error clearing external accounts:', error);
        throw error;
    }
}; 