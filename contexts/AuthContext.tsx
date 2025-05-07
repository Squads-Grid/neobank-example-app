import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AuthContextType, AccountInfo } from '@/types/Auth';
import { authenticateUser, verifyOtpCode } from '@/utils/auth';
import * as SecureStore from 'expo-secure-store';

const AUTH_STORAGE_KEYS = {
    EMAIL: 'auth_email',
    ACCOUNT_INFO: 'auth_account_info',
    KEYPAIR: 'auth_keypair',
    CREDENTIALS_BUNDLE: 'auth_credentials_bundle',
    WALLET: 'auth_wallet',
    IS_AUTHENTICATED: 'auth_is_authenticated'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [keypair, setKeypair] = useState<AuthContextType['keypair']>(null);
    const [credentialsBundle, setCredentialsBundle] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [wallet, setWallet] = useState<string | null>(null);
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load persisted auth state on mount
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const [
                    storedEmail,
                    storedAccountInfo,
                    storedKeypair,
                    storedCredentialsBundle,
                    storedWallet,
                    storedIsAuthenticated
                ] = await Promise.all([
                    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.EMAIL),
                    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO),
                    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.KEYPAIR),
                    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE),
                    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.WALLET),
                    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED)
                ]);

                if (storedEmail) setEmail(storedEmail);
                if (storedAccountInfo) setAccountInfo(JSON.parse(storedAccountInfo));
                if (storedKeypair) setKeypair(JSON.parse(storedKeypair));
                if (storedCredentialsBundle) setCredentialsBundle(storedCredentialsBundle);
                if (storedWallet) setWallet(storedWallet);
                if (storedIsAuthenticated) setIsAuthenticated(storedIsAuthenticated === 'true');


            } catch (error) {
                console.error('Error loading auth state:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthState();
    }, []);

    // Persist auth state changes
    useEffect(() => {
        const persistAuthState = async () => {
            try {

                await Promise.all([
                    email ? SecureStore.setItemAsync(AUTH_STORAGE_KEYS.EMAIL, email) : SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.EMAIL),
                    accountInfo ? SecureStore.setItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO, JSON.stringify(accountInfo)) : SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO),
                    keypair ? SecureStore.setItemAsync(AUTH_STORAGE_KEYS.KEYPAIR, JSON.stringify(keypair)) : SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.KEYPAIR),
                    credentialsBundle ? SecureStore.setItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE, credentialsBundle) : SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE),
                    wallet ? SecureStore.setItemAsync(AUTH_STORAGE_KEYS.WALLET, wallet) : SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.WALLET),
                    SecureStore.setItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED, String(isAuthenticated))
                ]);

            } catch (error) {
                console.error('Error persisting auth state:', error);
            }
        };

        persistAuthState();
    }, [email, accountInfo, keypair, credentialsBundle, wallet, isAuthenticated]);

    useEffect(() => {

        if (isAuthenticated === false) {
            router.replace('/(auth)/start');
        }
    }, [isAuthenticated]);

    const verifyCode = async (code: string, otpId: string): Promise<boolean> => {
        try {
            if (!accountInfo) {
                return false;
            }

            const { credentialBundle, keypair } = await verifyOtpCode(code, otpId, accountInfo.user_id);

            if (!keypair || !keypair.privateKey || !keypair.publicKey) {
                return false;
            }

            // Store the keypair in SecureStore immediately
            await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.KEYPAIR, JSON.stringify(keypair));

            setCredentialsBundle(credentialBundle);
            setKeypair(keypair);
            setIsAuthenticated(true);
            setAuthError(null);

            router.replace('/success');
            return true;
        } catch (error) {
            console.error("🚀 ~ verifyCode ~ Error:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            return false;
        }
    };

    const logout = async () => {
        try {
            // Clear all auth state
            setEmail(null);
            setAccountInfo(null);
            setIsAuthenticated(false);
            setCredentialsBundle(null);
            setKeypair(null);
            setAuthError(null);
            setWallet(null);

            // Clear all stored auth data
            await Promise.all([
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.EMAIL),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.KEYPAIR),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.WALLET),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED)
            ]);

            // Replace the entire stack with the start screen
            router.replace('/(auth)/start');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        }
    };

    const authenticate = async (email: string): Promise<string> => {
        try {
            const { otpId, accountInfo } = await authenticateUser(email);

            setAccountInfo(accountInfo);
            setEmail(email);
            setAuthError(null);
            setWallet(accountInfo.public_key);
            return otpId;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                email,
                setEmail,
                accountInfo,
                setAccountInfo,
                keypair,
                credentialsBundle,
                authError,
                authenticate,
                verifyCode,
                logout,
                wallet,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 