import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/utils/secure-storage';
import { router } from 'expo-router';
import { AuthenticationResponse, OTPData } from '@/types/Authentication';
import { Keypair } from '@/types/Crypto';
import { generateKeyPairP256 } from '@/utils/helper';
interface AuthContextType {
    isAuthenticated: boolean | null;
    user: User | null;
    keypair: Keypair | null;
    credentialsBundle: string | null;
    authenticate: (email: string) => Promise<string>;
    verifyCode: (code: string, otpId: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isLoading: boolean;
    initialAuthCheck: boolean;
}

interface User {
    suborgId: string;
    email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BASE_URL = "http://192.168.188.27:8081/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initialAuthCheck, setInitialAuthCheck] = useState(false);
    const [keypair, setKeypair] = useState<Keypair | null>(null);
    const [credentialsBundle, setCredentialsBundle] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // TODO: check if credentialsBundle is valid
            setIsAuthenticated(!!credentialsBundle);
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            router.replace('/(auth)/start');
        } finally {
            setIsLoading(false);
            setInitialAuthCheck(true);
        }
    };

    const verifyCode = async (code: string, otpId: string): Promise<boolean> => {
        try {

            const keyPair = await generateKeyPairP256();

            const otpData = {
                otp_code: code,
                otp_id: otpId,
                public_key: keyPair.publicKeyUncompressed,
                expiration: 900, // 15 minutes
                sub_organization_id: user?.suborgId
            }
            console.log("🚀 ~ callLogin ~ BASE_URL:", BASE_URL)
            const response = await fetch(`${BASE_URL}/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(otpData)
            });

            const result = await response.json();
            console.log("🚀 ~ verifyCode ~ result:", result)
            setCredentialsBundle(result.data.credential_bundle);
            setKeypair(result.data.keypair);
            setIsAuthenticated(!!result.data.credential_bundle);

            // Navigate to success page
            router.replace('/success');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear tokens from storage
            await storage.clearTokens();

            // Clear auth state
            setUser(null);
            setIsAuthenticated(false);
            setCredentialsBundle(null);
            setKeypair(null);

            // Replace the entire stack with the start screen
            router.replace('/(auth)/start');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const authenticate = async (email: string): Promise<string> => {
        console.log("🚀 ~ callLogin ~ email::::::::::::::::: ", email)
        try {
            console.log("🚀 ~ callLogin ~ BASE_URL:", BASE_URL)
            const response = await fetch(`${BASE_URL}/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    app_name: "Bright",
                    app_icon_url: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    expiration_seconds: 3600
                })
            });

            const result = await response.json();
            const data = result.data;
            setUser({ suborgId: data.sub_organization_id, email });

            return data.otp_id;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // const signIn = async (email: string, code: string): Promise<void> => {
    //     console.log("🚀 ~ signIn ~ email:", email)
    //     try {
    //         setIsLoading(true);

    //         const response = await callLogin(email, code);
    //         // const { accessToken, refreshToken, user } = response;

    //         // // Store tokens
    //         // await storage.saveTokens(accessToken, refreshToken);

    //         // Update state
    //         setIsAuthenticated(true);
    //         setUser(user);

    //         // Navigate to success screen
    //         router.push('/success');
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         throw error;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                keypair,
                credentialsBundle,
                authenticate,
                verifyCode,
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