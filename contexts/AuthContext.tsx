import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AuthContextType } from '@/types/Auth';
import { authenticateUser, verifyOtpCode } from '@/utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [suborgId, setSuborgId] = useState<string | null>(null);
    const [keypair, setKeypair] = useState<AuthContextType['keypair']>(null);
    const [credentialsBundle, setCredentialsBundle] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.replace('/(auth)/start');
        }
    }, [isAuthenticated]);

    const verifyCode = async (code: string, otpId: string): Promise<boolean> => {
        try {
            if (!suborgId) {
                throw new Error('Suborganization ID is required');
            }

            const { credentialBundle, keypair } = await verifyOtpCode(code, otpId, suborgId);

            setCredentialsBundle(credentialBundle);
            setKeypair(keypair);
            setIsAuthenticated(true);
            setAuthError(null);

            router.replace('/success');
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAuthError(errorMessage);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear all auth state
            setEmail(null);
            setSuborgId(null);
            setIsAuthenticated(false);
            setCredentialsBundle(null);
            setKeypair(null);
            setAuthError(null);

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
            const { otpId, suborgId: newSuborgId } = await authenticateUser(email);

            setSuborgId(newSuborgId);
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
                suborgId,
                setSuborgId,
                keypair,
                credentialsBundle,
                authError,
                authenticate,
                verifyCode,
                logout,
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