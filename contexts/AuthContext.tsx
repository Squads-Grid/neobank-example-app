import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Keypair } from '@/types/Crypto';
import { generateKeyPairP256 } from '@/utils/helper';
interface AuthContextType {
    isAuthenticated: boolean | null;
    email: string | null;
    suborgId: string | null;
    setEmail: React.Dispatch<React.SetStateAction<string | null>>;
    setSuborgId: React.Dispatch<React.SetStateAction<string | null>>;
    keypair: Keypair | null;
    credentialsBundle: string | null;
    authenticate: (email: string) => Promise<string>;
    verifyCode: (code: string, otpId: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BASE_URL = `${process.env.EXPO_PUBLIC_BASE_URL}${process.env.EXPO_PUBLIC_API_ENDPOINT}` //"http://192.168.188.27:8081/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [suborgId, setSuborgId] = useState<string | null>(null);
    const [keypair, setKeypair] = useState<Keypair | null>(null);
    const [credentialsBundle, setCredentialsBundle] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.replace('/(auth)/start');
        }
    }, [isAuthenticated]);

    const verifyCode = async (code: string, otpId: string): Promise<boolean> => {
        try {
            const keyPair = await generateKeyPairP256();

            const otpData = {
                otp_code: code,
                otp_id: otpId,
                public_key: keyPair.publicKeyUncompressed,
                expiration: 900, // 15 minutes
                sub_organization_id: suborgId
            }
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

            // Clear auth state
            setEmail(null);
            setSuborgId(null);
            setIsAuthenticated(false);
            setCredentialsBundle(null);
            setKeypair(null);
            console.log("🚀 ~ logout ~ credentialsBundle:", credentialsBundle)

            // Replace the entire stack with the start screen
            router.replace('/(auth)/start');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const authenticate = async (email: string): Promise<string> => {
        try {
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
            setSuborgId(data.sub_organization_id);
            setEmail(email);

            return data.otp_id;
        } catch (error) {
            console.error('Login error:', error);
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