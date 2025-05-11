import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AuthContextType, AccountInfo } from '@/types/Auth';
import { authenticateUser, verifyOtpCode } from '@/utils/auth';
import * as SecureStore from 'expo-secure-store';
import { LoadingSpinner } from '@/components/ui/atoms/LoadingSpinner';
import { KycStatus } from '@/types/Kyc';

const AUTH_STORAGE_KEYS = {
    EMAIL: 'auth_email',
    ACCOUNT_INFO: 'auth_account_info',
    KEYPAIR: 'auth_keypair',
    CREDENTIALS_BUNDLE: 'auth_credentials_bundle',
    WALLET: 'auth_wallet',
    IS_AUTHENTICATED: 'auth_is_authenticated',
    MPC_PRIMARY_ID: 'auth_mpc_primary_id',
    KYC_STATUS: 'auth_kyc_status'
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
    const [mpcPrimaryId, setMpcPrimaryId] = useState<string | null>(null);
    const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);

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
                    const kycStatus = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.KYC_STATUS);

                    if (accountInfo && keypair && credentialsBundle && email) {
                        setAccountInfo(JSON.parse(accountInfo));
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

    const updateKycStatus = async (status: KycStatus) => {
        try {
            await SecureStore.setItemAsync(AUTH_STORAGE_KEYS.KYC_STATUS, status);
            setKycStatus(status);
        } catch (error) {
            console.error('Error updating KYC status:', error);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

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
                SecureStore.setItemAsync(AUTH_STORAGE_KEYS.ACCOUNT_INFO, JSON.stringify(accountInfo))
            ]);

            setCredentialsBundle(credentialBundle);
            setKeypair(keypair);
            setIsAuthenticated(true);
            setAuthError(null);
            setAccountInfo(accountInfo);

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
                kycStatus,
                updateKycStatus
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