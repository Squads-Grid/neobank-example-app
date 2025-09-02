import * as SecureStore from 'expo-secure-store';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { AccountInfo } from '@/types/Auth';

export const AuthStorage = {

    async saveIsAuthenticated(isAuthenticated: boolean) {
        await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED, isAuthenticated ? 'true' : 'false');
    },

    async isAuthenticated() {
        const isAuthenticated = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED);
        return isAuthenticated === 'true';
    },

    async saveEmail(email: string) {
        await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.PERSISTENT_EMAIL, email);
    },

    async getEmail() {
        const email = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.PERSISTENT_EMAIL);
        return email;
    },

    async saveUserData(user: any) {
        await Promise.all([
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.USER, JSON.stringify(user)),
        ]);
    },

    async getUser() {
        const user = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },

    async saveSessionSecrets(sessionSecrets: any) {
        await Promise.all([
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.SESSION_SECRETS, JSON.stringify(sessionSecrets)),
        ]);
    },

    async getSessionSecrets() {
        const sessionSecrets = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.SESSION_SECRETS);
        return sessionSecrets ? JSON.parse(sessionSecrets) : null;
    },

    async saveAuthData(data: {
        keypair: any,
        credentialsBundle: string,
        accountInfo: AccountInfo,
        email: string,
        gridUserId?: string,
        smartAccountAddress?: string,
    }) {
        await Promise.all([
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.KEYPAIR, JSON.stringify(data.keypair)),
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE, data.credentialsBundle),
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO, JSON.stringify(data.accountInfo)),
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.EMAIL, data.email),
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED, 'true'),
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID, data.gridUserId ?? ''),
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.SMART_ACCOUNT_ADDRESS, data.smartAccountAddress ?? ''),
        ]);
    },

    async getAuthData() {
        const [
            keypair,
            credentialsBundle,
            accountInfo,
            email,
            isAuthenticated,
            gridUserId,
            smartAccountAddress,
        ] = await Promise.all([
            SecureStore.getItemAsync(AUTH_STORAGE_KEYS.KEYPAIR),
            SecureStore.getItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE),
            SecureStore.getItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO),
            SecureStore.getItemAsync(AUTH_STORAGE_KEYS.EMAIL),
            SecureStore.getItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED),
            SecureStore.getItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID),
            SecureStore.getItemAsync(AUTH_STORAGE_KEYS.SMART_ACCOUNT_ADDRESS),
        ]);

        return {
            keypair: keypair ? JSON.parse(keypair) : null,
            credentialsBundle,
            accountInfo: accountInfo ? JSON.parse(accountInfo) : null,
            email,
            isAuthenticated: isAuthenticated === 'true',
            gridUserId,
            smartAccountAddress,
        };
    },

    async clearAuthData() {
        await Promise.all([
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.KEYPAIR),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.WALLET),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.SMART_ACCOUNT_ADDRESS),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.KYC_STATUS),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.SESSION_SECRETS),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.USER),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED),
            SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.PERSISTENT_EMAIL)
        ]);
    }
}; 