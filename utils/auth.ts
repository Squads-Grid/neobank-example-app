import { Keypair, AuthenticationRequest, OTPData, AccountInfo } from '@/types/Auth';
import { easClient } from '@/utils/easClient';
import { generateKeyPairP256 } from '@/utils/helper';

export const validateEnv = () => {
    if (!process.env.EXPO_PUBLIC_BASE_URL || !process.env.EXPO_PUBLIC_API_ENDPOINT) {
        throw new Error('Missing required environment variables: EXPO_PUBLIC_BASE_URL and EXPO_PUBLIC_API_ENDPOINT');
    }
};

export const generateKeyPairForAuth = async (): Promise<Keypair> => {
    const keypair = await generateKeyPairP256();
    return {
        publicKey: keypair.publicKey,
        privateKey: keypair.privateKey,
        publicKeyUncompressed: keypair.publicKeyUncompressed
    };
};

export const authenticateUser = async (email: string): Promise<{ otpId: string; accountInfo: AccountInfo }> => {
    const request: AuthenticationRequest = {
        email,
        app_name: "Bright",
        app_icon_url: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        expiration: 3600
    };

    const response = await easClient.authenticate(request);
    return {
        otpId: response.data.otp_id,
        accountInfo: response.data.account_info
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

    const response = await easClient.verifyOtp(otpData);
    return {
        credentialBundle: response.data.credential_bundle,
        keypair: response.data.keypair
    };
}; 