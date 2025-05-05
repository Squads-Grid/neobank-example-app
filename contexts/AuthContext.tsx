import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AuthContextType, AccountInfo } from '@/types/Auth';
import { authenticateUser, verifyOtpCode } from '@/utils/auth';
import * as SecureStore from 'expo-secure-store';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [keypair, setKeypair] = useState<AuthContextType['keypair']>(null);
    const [credentialsBundle, setCredentialsBundle] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [wallet, setWallet] = useState<string | null>(null);
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

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

            setCredentialsBundle(credentialBundle);
            setKeypair(keypair);
            setIsAuthenticated(true);
            setAuthError(null);

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

            // TODO: Replace saving gridUserId
            // Clear the gridUserId from the secure store
            await SecureStore.deleteItemAsync('gridUserId');

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