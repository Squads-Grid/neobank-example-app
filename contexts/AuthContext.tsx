import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AccountInfo, AuthContextType, } from '@/types/Auth';
import { authenticateUser, verifyOtpCode, AUTH_STORAGE_KEYS } from '@/utils/auth';
import * as SecureStore from 'expo-secure-store';
import { KycStatus } from '@/types/Kyc';

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
    const [mpcPrimaryId, setMpcPrimaryId] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedAuth = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED);

                if (storedAuth === 'true') {
                    const accountInfo = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO);
                    const keypair = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.KEYPAIR);
                    const credentialsBundle = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE);
                    const email = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.EMAIL);
                    const wallet = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.WALLET);
                    const gridUserId = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID);
                    const smartAccountAddress = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.SMART_ACCOUNT_ADDRESS);

                    if (accountInfo && keypair && credentialsBundle && email) {
                        setAccountInfo({ ...JSON.parse(accountInfo), grid_user_id: gridUserId, smart_account_address: smartAccountAddress });
                        setKeypair(JSON.parse(keypair));
                        setCredentialsBundle(credentialsBundle);
                        setEmail(email);
                        setWallet(wallet);
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const verifyCode = async (code: string, otpId: string): Promise<boolean> => {
        try {
            if (!mpcPrimaryId) {
                throw new Error('No mpcPrimaryId found');
            }

            const { credentialBundle, keypair, accountInfo } = await verifyOtpCode(code, otpId, mpcPrimaryId);

            if (!keypair || !keypair.privateKey || !keypair.publicKey) {
                return false;
            }

            // Store all auth data in SecureStore
            // TODO: Check what to do with the keypair
            await Promise.all([
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.KEYPAIR, JSON.stringify(keypair)),
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE, credentialBundle),
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED, 'true'),
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO, JSON.stringify(accountInfo)),
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID, accountInfo.grid_user_id ?? ''),
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.SMART_ACCOUNT_ADDRESS, accountInfo.smart_account_address ?? ''),
            ]);

            // Helper for kyc
            const emailFromStorage = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.PERSISTENT_EMAIL);

            if (emailFromStorage !== email) {
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.PERSISTENT_EMAIL, email ?? '');
            }

            setCredentialsBundle(credentialBundle);
            setKeypair(keypair);
            setIsAuthenticated(true);
            setAuthError(null);
            setAccountInfo(accountInfo);

            router.replace('/success');
            return true;
        } catch (error) {
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
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.KEYPAIR),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.CREDENTIALS_BUNDLE),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.WALLET),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.IS_AUTHENTICATED),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.GRID_USER_ID),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.SMART_ACCOUNT_ADDRESS),
                SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.KYC_STATUS),
            ]);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        }
    };

    const authenticate = async (email: string): Promise<string> => {
        try {
            const { otpId, mpcPrimaryId } = await authenticateUser(email);

            // Store initial auth data
            await Promise.all([
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.EMAIL, email),
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.MPC_PRIMARY_ID, mpcPrimaryId)
            ]);

            setMpcPrimaryId(mpcPrimaryId);
            setEmail(email);
            setAuthError(null);
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
                isLoading,
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