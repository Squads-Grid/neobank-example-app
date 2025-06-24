import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AccountInfo, AuthContextType } from '@/types/Auth';
import { authenticateUser, verifyOtpCode } from '@/utils/auth';
import { AuthStorage } from '@/utils/storage/authStorage';
import * as Sentry from '@sentry/react-native';

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
                const authData = await AuthStorage.getAuthData();

                if (authData.isAuthenticated && authData.accountInfo && authData.keypair && authData.credentialsBundle && authData.email) {
                    setAccountInfo(authData.accountInfo);
                    setKeypair(authData.keypair);
                    setCredentialsBundle(authData.credentialsBundle);
                    setEmail(authData.email);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                Sentry.captureException(new Error(`Error initializing auth: ${error}. (contexts)/AuthContext.tsx (initializeAuth)`));
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
            console.log("🚀 ~ verifyCode ~ mpcPrimaryId:", mpcPrimaryId)

            const { credentialBundle, keypair, accountInfo } = await verifyOtpCode(code, otpId, mpcPrimaryId);
            console.log("🚀 ~ verifyCode ~ keypair:", keypair)
            console.log("🚀 ~ verifyCode ~ credentialBundle:", credentialBundle)
            console.log("🚀 ~ verifyCode ~ accountInfo:", accountInfo)

            if (!keypair || !keypair.privateKey || !keypair.publicKey) {
                return false;
            }

            await AuthStorage.saveAuthData({
                keypair,
                credentialsBundle: credentialBundle,
                accountInfo,
                email: email ?? '',
                gridUserId: accountInfo.grid_user_id,
                smartAccountAddress: accountInfo.smart_account_address,
            });

            setCredentialsBundle(credentialBundle);
            setKeypair(keypair);
            setIsAuthenticated(true);
            setAuthError(null);
            setAccountInfo(accountInfo);

            router.replace('/success');
            return true;
        } catch (error) {
            Sentry.captureException(new Error(`Error verifying code: ${error}. (contexts)/AuthContext.tsx (verifyCode)`));
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
            await AuthStorage.clearAuthData();
        } catch (error) {
            Sentry.captureException(new Error(`Failed to logout: ${error}. (contexts)/AuthContext.tsx (logout)`));
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        }
    };

    const authenticate = async (email: string): Promise<string> => {
        try {
            const { otpId, mpcPrimaryId } = await authenticateUser(email);
            console.log("🚀 ~ authenticate ~ otpId:", otpId)
            console.log("🚀 ~ authenticate ~ mpcPrimaryId:", mpcPrimaryId)

            // Store initial auth data
            await AuthStorage.saveAuthData({
                keypair: null,
                credentialsBundle: '',
                accountInfo: {} as AccountInfo,
                email,
            });

            setMpcPrimaryId(mpcPrimaryId);
            setEmail(email);
            setAuthError(null);
            return otpId;
        } catch (error) {
            Sentry.captureException(new Error(`Error authenticating: ${error}. (contexts)/AuthContext.tsx (authenticate)`));
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