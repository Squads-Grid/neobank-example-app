import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AccountInfo, AuthContextType } from '@/types/Auth';
import { authenticateUser, verifyOtpCodeAndCreateAccount, registerUser } from '@/utils/auth';
import { AuthStorage } from '@/utils/storage/authStorage';
import * as Sentry from '@sentry/react-native';
import { GridClient, GridEnvironment, UniversalKeyPair } from '@sqds/grid/native';

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

    const verifyCodeAndCreateAccount = async (code: string): Promise<boolean> => {
        console.log("🚀 ~ verifyCodeAndCreateAccount ~ code:", code)
        try {
            const gridClient = new GridClient({
                environment: 'sandbox' as GridEnvironment,
                baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
            });
            const sessionSecrets = await gridClient.generateSessionSecrets();

            await AuthStorage.saveSessionSecrets(sessionSecrets);
            const user = await AuthStorage.getUser();

            const result = await verifyOtpCodeAndCreateAccount(code, sessionSecrets, user);

            await setIsAuthenticated(true);
            setAuthError(null);
            await AuthStorage.saveUserData(result);
            
            console.log("🚀 ~ verifyCodeAndCreateAccount successful");

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
            if (!mpcPrimaryId) {
                throw new Error('No mpcPrimaryId found');
            }
            console.log("🚀 ~ verifyCode ~ mpcPrimaryId:", mpcPrimaryId)

            // const { credentialBundle, keypair, accountInfo } = await verifyOtpCode(code, mpcPrimaryId);
            // console.log("🚀 ~ verifyCode ~ keypair:", keypair)
            // console.log("🚀 ~ verifyCode ~ credentialBundle:", credentialBundle)
            // console.log("🚀 ~ verifyCode ~ accountInfo:", accountInfo)

            // // if (!keypair || !keypair.privateKey || !keypair.publicKey) {
            // //     return false;
            // // }

            // await AuthStorage.saveAuthData({
            //     keypair,
            //     credentialsBundle: credentialBundle,
            //     accountInfo,
            //     email: email ?? '',
            //     gridUserId: accountInfo.grid_user_id,
            //     smartAccountAddress: accountInfo.smart_account_address,
            // });

            // setCredentialsBundle(credentialBundle);
            // setKeypair(keypair as unknown as UniversalKeyPair); // TODO: fix this
            // setIsAuthenticated(true);
            // setAuthError(null);
            // setAccountInfo(accountInfo);

            // router.replace('/success');
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

    const authenticate = async (email: string): Promise<void> => {
        try {
            const result= await authenticateUser(email);
            console.log("🚀 ~ authenticate ~ result:", result)

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


        } catch (error) {
            Sentry.captureException(new Error(`Error authenticating: ${error}. (contexts)/AuthContext.tsx (authenticate)`));
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        }
    };

    const register = async (email: string): Promise<void> => {
        console.log("🚀 ~ register ~ email in AuthContext:", email)
        try {
            const result= await registerUser(email);
            console.log("🚀 ~ register ~ result in AuthContext:", result)

            // Store initial auth data
            await AuthStorage.saveUserData(result);

            setMpcPrimaryId(mpcPrimaryId);
            setEmail(email);
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