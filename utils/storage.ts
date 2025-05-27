import * as SecureStore from 'expo-secure-store';

/**
 * Storage service for handling secure storage operations
 */
export class StorageService {
    /**
     * Set a value in secure storage
     * @param key - The key to store the value under
     * @param value - The value to store (can be string, number, boolean, array, or object)
     */
    static async setItem(key: string, value: string | number | boolean | any[] | object): Promise<void> {

        try {
            const stringValue = JSON.stringify(value);
            await SecureStore.setItemAsync(key, stringValue);
        } catch (error) {
            console.error(`Error setting item ${key}:`, error);
            throw error;
        }
    }

    /**
     * Get a value from secure storage
     * @param key - The key to retrieve
     * @returns The stored value, or null if not found
     */
    static async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = await SecureStore.getItemAsync(key);
            if (value === null) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            console.error(`Error getting item ${key}:`, error);
            return null;
        }
    }

    /**
     * Delete a value from secure storage
     * @param key - The key to delete
     */
    static async deleteItem(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error(`Error deleting item ${key}:`, error);
            throw error;
        }
    }

    /**
     * Check if a key exists in secure storage
     * @param key - The key to check
     * @returns boolean indicating if the key exists
     */
    static async hasItem(key: string): Promise<boolean> {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value !== null;
        } catch (error) {
            console.error(`Error checking item ${key}:`, error);
            return false;
        }
    }
} 