import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AuthContextType, AccountInfo } from '@/types/Auth';
import { authenticateUser, verifyOtpCode } from '@/utils/auth';
import * as SecureStore from 'expo-secure-store';
import { LoadingSpinner } from '@/components/ui/atoms/LoadingSpinner';

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
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [keypair, setKeypair] = useState<AuthContextType['keypair']>(null);
    const [credentialsBundle, setCredentialsBundle] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [wallet, setWallet] = useState<string | null>(null);
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check for stored auth data
                const storedAuth = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED);
                console.log("🚀 ~ initializeAuth ~ storedAuth:", storedAuth)
                if (storedAuth === 'true') {
                    const accountInfo = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO);
                    const keypair = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.KEYPAIR);
                    const credentialsBundle = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE);
                    const email = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.EMAIL);
                    const wallet = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.WALLET);

                    if (accountInfo && keypair && credentialsBundle && email) {
                        setAccountInfo(JSON.parse(accountInfo));
                        setKeypair(JSON.parse(keypair));
                        setCredentialsBundle(credentialsBundle);
                        setEmail(email);
                        setWallet(wallet);
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

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