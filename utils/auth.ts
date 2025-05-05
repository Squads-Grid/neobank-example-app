import { Keypair, AuthenticationRequest, OTPData } from '@/types/Auth';
import { apiClient } from '@/utils/client';
import { generateKeyPairP256 } from '@/utils/helper';

const BASE_URL = `${process.env.EXPO_PUBLIC_BASE_URL}${process.env.EXPO_PUBLIC_API_ENDPOINT}`;

export const validateEnv = () => {
    if (!process.env.EXPO_PUBLIC_BASE_URL || !process.env.EXPO_PUBLIC_API_ENDPOINT) {
        throw new Error('Missing required environment variables: EXPO_PUBLIC_BASE_URL and EXPO_PUBLIC_API_ENDPOINT');
    }
};

export const generateKeyPairForAuth = async (): Promise<Keypair> => {
    // Implementation of key pair generation
    // This is a placeholder - implement your actual key generation logic
    const keypair = await generateKeyPairP256();
    return {
        publicKey: keypair.publicKey,
        privateKey: keypair.privateKey,
        publicKeyUncompressed: keypair.publicKeyUncompressed
    };
};

export const authenticateUser = async (email: string): Promise<{ otpId: string; suborgId: string }> => {
    const request: AuthenticationRequest = {
        email,
        app_name: "Bright",
        app_icon_url: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        expiration: 3600
    };

    const response = await apiClient.authenticate(request);
    return {
        otpId: response.data.otp_id,
        suborgId: response.data.sub_organization_id
    };
};

export const verifyOtpCode = async (code: string, otpId: string, suborgId: string): Promise<{ credentialBundle: string; keypair: Keypair }> => {
    const keyPair = await generateKeyPairP256();

    const otpData: OTPData = {
        otp_code: code,
        otp_id: otpId,
        public_key: keyPair.publicKeyUncompressed,
        expiration: 900, // 15 minutes
        sub_organization_id: suborgId
    };

    const response = await apiClient.verifyOtp(otpData);
    return {
        credentialBundle: response.data.credential_bundle,
        keypair: response.data.keypair
    };
}; 