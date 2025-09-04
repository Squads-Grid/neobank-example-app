import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AccountInfo, AuthContextType } from '@/types/Auth';
import { authenticateUser, verifyOtpCodeAndCreateAccount, registerUser, verifyOtpCode } from '@/utils/auth';
import { AuthStorage } from '@/utils/storage/authStorage';
import * as Sentry from '@sentry/react-native';
import { SDKGridClient } from '../grid/sdkClient';
import { MockDatabase } from '@/utils/mockDatabase';

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
    const [user, setUser] = useState<any | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const user = await AuthStorage.getUser();
                setUser(user);
                const savedEmail = await AuthStorage.getEmail();
                setEmail(savedEmail);
                const isAuthenticated = await AuthStorage.isAuthenticated();
                setIsAuthenticated(isAuthenticated);

                // if (user && sessionSecrets) {
                //     setIsAuthenticated(true);
                // } else {
                //     setIsAuthenticated(false);
                // }
            } catch (error) {
                console.error('Error initializing auth:', error);
                Sentry.captureException(new Error(`Error initializing auth: ${error}. (contexts)/AuthContext.tsx (initializeAuth)`));
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [user]);

    const verifyCodeAndCreateAccount = async (code: string): Promise<boolean> => {
        try {
            const gridClient = SDKGridClient.getFrontendClient();
            const sessionSecrets = await gridClient.generateSessionSecrets();

            await AuthStorage.saveSessionSecrets(sessionSecrets);
            const user = await AuthStorage.getUser();
            
            const result = await verifyOtpCodeAndCreateAccount(code, sessionSecrets, user);
            setUser(result);

            // Create user in MockDatabase with email
            if (result.grid_user_id && email) {
                await MockDatabase.createUser(result.grid_user_id, email);
            }

            setIsAuthenticated(true);
            await AuthStorage.saveIsAuthenticated(true);
            setAuthError(null);
            await AuthStorage.saveUserData(result);
            
            return true;
        } catch (error) {
            Sentry.captureException(new Error(`Error verifying code: ${error}. (contexts)/AuthContext.tsx (verifyCode)`));
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            return false;
        }
    };

    const verifyCode = async (code: string): Promise<boolean> => {
        try {
            const gridClient = SDKGridClient.getFrontendClient();
            const sessionSecrets = await gridClient.generateSessionSecrets();

            await AuthStorage.saveSessionSecrets(sessionSecrets);

            const userData = await AuthStorage.getUser();

            if (!userData) {
                throw new Error('User not found');
                }

            const result = await verifyOtpCode(code, sessionSecrets, userData);
            setUser(result);

            // Create user in MockDatabase with email
            if (result.grid_user_id && email) {
                await MockDatabase.createUser(result.grid_user_id, email);
            }

            setIsAuthenticated(true);
            await AuthStorage.saveIsAuthenticated(true);
            setAuthError(null);
            await AuthStorage.saveUserData(result);
            

            return true;
        } catch (error) {
            Sentry.captureException(new Error(`Error verifying code: ${error}. (contexts)/AuthContext.tsx (verifyCode)`));
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            return false;
        }
    };

    const logout = async () => {
        setIsLoggingOut(true);
        try {
            // Clear all stored auth data
            await AuthStorage.clearAuthData();
            
            // Reset authentication state
            setIsAuthenticated(false);
            setUser(null);
            setEmail(null);
            setAccountInfo(null);
            setCredentialsBundle(null);
            setKeypair(null);
            setWallet(null);
            setMpcPrimaryId(null);
            
            // Navigate to start/login screen
            router.replace('/');
        } catch (error) {
            Sentry.captureException(new Error(`Failed to logout: ${error}. (contexts)/AuthContext.tsx (logout)`));
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        } finally {
            setIsLoggingOut(false);
        }
    };

    const authenticate = async (email: string): Promise<void> => {
        try {
            const result= await authenticateUser(email);
            setUser(result);
            setEmail(email);
            await AuthStorage.saveUserData(result);
            await AuthStorage.saveEmail(email);

            setAuthError(null);


        } catch (error) {
            Sentry.captureException(new Error(`Error authenticating: ${error}. (contexts)/AuthContext.tsx (authenticate)`));
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        }
    };

    const register = async (email: string): Promise<void> => {
        try {
            const result= await registerUser(email);
            setUser(result);
            setEmail(email);

            // Store initial auth data
            await AuthStorage.saveUserData(result);
            await AuthStorage.saveEmail(email);

            setMpcPrimaryId(mpcPrimaryId);
            setAuthError(null);
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
                user,
                email,
                setEmail,
                accountInfo,
                setAccountInfo,
                keypair,
                credentialsBundle,
                authError,
                authenticate,
                register,
                verifyCode,
                verifyCodeAndCreateAccount,
                logout,
                wallet,
                isLoading,
                isLoggingOut,
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