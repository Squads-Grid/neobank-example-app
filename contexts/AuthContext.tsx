import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/utils/secure-storage';
import { router } from 'expo-router';

interface AuthContextType {
    isAuthenticated: boolean | null;
    user: User | null;
    signIn: (email: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    initialAuthCheck: boolean;
}

interface User {
    id: string;
    email: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initialAuthCheck, setInitialAuthCheck] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { accessToken } = await storage.getTokens();
            if (!accessToken) {
                router.replace('/(auth)/start');
            }
            setIsAuthenticated(!!accessToken);
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            router.replace('/(auth)/start');
        } finally {
            setIsLoading(false);
            setInitialAuthCheck(true);
        }
    };

    const verifyCode = async (code: string): Promise<boolean> => {
        // TODO: Implement actual verification logic with your backend
        // For now, we'll just simulate a successful verification
        if (code === '123456') {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = async () => {
        try {
            // Clear tokens from storage
            await storage.clearTokens();

            // Clear auth state
            setUser(null);
            setIsAuthenticated(false);

            // Replace the entire stack with the start screen
            router.replace('/(auth)/start');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const callLogin = async (email: string, code: string): Promise<LoginResponse> => {
        try {
            // const response = await fetch('YOUR_API_URL/auth/login', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({ email, code }),
            // });

            // Mock api call
            const response = await new Promise<LoginResponse>((resolve) => setTimeout(() => {
                resolve({
                    accessToken: 'mock_access_token',
                    refreshToken: 'mock_refresh_token',
                    user: { id: '1', email: 'test@example.com' },
                });
            }, 1000));

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const signIn = async (email: string, code: string): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await callLogin(email, code);
            const { accessToken, refreshToken, user } = response;

            // Store tokens
            await storage.saveTokens(accessToken, refreshToken);

            // Update state
            setIsAuthenticated(true);
            setUser(user);

            // Add a small delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate to success screen
            router.push('/success');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                signIn,
                logout,
                isLoading,
                initialAuthCheck,
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