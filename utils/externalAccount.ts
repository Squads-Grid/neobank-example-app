import { AUTH_STORAGE_KEYS } from './auth';
import { ExternalAccountMapping, ExternalAccountStorage } from '@/types/Transaction';
import { StorageService } from './storage';
import * as Sentry from '@sentry/react-native';

/**
 * Service for managing external account mappings
 */
export class ExternalAccountService {
    /**
     * Store an external account mapping
     * @param gridUserId - The Grid user ID
     * @param externalAccountId - The external account ID
     * @param label - The label for the account
     */
    static async storeAccount(gridUserId: string, externalAccountId: string, label: string): Promise<void> {
        try {
            // Get existing storage
            const existingStorage = await StorageService.getItem<ExternalAccountStorage>(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
            let storage: ExternalAccountStorage;
            let alreadyExists = false;

            if (existingStorage) {
                storage = existingStorage;
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
                    label: label || `External Account ${storage.accounts.length + 1}`
                });
            }

            // Save updated storage
            await StorageService.setItem(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS, storage);
        } catch (error) {
            Sentry.captureException(new Error(`Error storing external account: ${error}. (utils)/externalAccount.ts (storeAccount) Label: ${label}`));
            console.error('Error storing external account:', error);
            throw error;
        }
    }

    /**
     * Get an external account ID for a given Grid user ID
     * @param gridUserId - The Grid user ID to look up
     * @returns The external account ID if found, null otherwise
     */
    static async getAccountId(gridUserId: string): Promise<string | null> {
        try {
            const storage = await StorageService.getItem<ExternalAccountStorage>(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
            if (!storage) return null;

            const mapping = storage.accounts.find(acc => acc.grid_user_id === gridUserId);
            return mapping?.external_account_id || null;
        } catch (error) {
            Sentry.captureException(new Error(`Error getting external account: ${error}. (utils)/externalAccount.ts (getAccountId)`));
            console.error('Error getting external account:', error);
            return null;
        }
    }

    /**
     * Get all external account mappings
     * @returns All external account mappings or null if none exist
     */
    static async getAllAccounts(): Promise<ExternalAccountStorage | null> {
        try {
            return await StorageService.getItem<ExternalAccountStorage>(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
        } catch (error) {
            Sentry.captureException(new Error(`Error getting external accounts: ${error}. (utils)/externalAccount.ts (getAllAccounts)`));
            console.error('Error getting external accounts:', error);
            return null;
        }
    }

    static async deleteAccount(gridUserId: string, externalAccountId: string): Promise<void> {
        try {
            const storage = await StorageService.getItem<ExternalAccountStorage>(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
            if (!storage) return;

            // Remove the account from the storage
            storage.accounts = storage.accounts.filter(acc => acc.grid_user_id !== gridUserId && acc.external_account_id !== externalAccountId);

            // Save the updated storage
            await StorageService.setItem(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS, storage);
        } catch (error) {
            Sentry.captureException(new Error(`Error deleting external account: ${error}. (utils)/externalAccount.ts (deleteAccount)`));
            console.error('Error deleting external account:', error);
        }
    }

    /**
     * Clear all external account mappings
     */
    static async clearAll(): Promise<void> {
        try {
            await StorageService.deleteItem(AUTH_STORAGE_KEYS.EXTERNAL_ACCOUNTS);
        } catch (error) {
            Sentry.captureException(new Error(`Error clearing external accounts: ${error}. (utils)/externalAccount.ts (clearAll)`));
            console.error('Error clearing external accounts:', error);
            throw error;
        }
    }
}

// For backward compatibility, export the old function names
export const storeExternalAccount = ExternalAccountService.storeAccount;
export const getExternalAccountId = ExternalAccountService.getAccountId;
export const getExternalAccountIds = ExternalAccountService.getAllAccounts;
export const clearExternalAccounts = ExternalAccountService.clearAll;
export const deleteAccount = ExternalAccountService.deleteAccount;