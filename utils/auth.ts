import { Keypair, AuthenticationRequest, OTPData, AccountInfo } from '@/types/Auth';
import { EasClient } from '@/utils/easClient';
import { setupCryptoPolyfill } from '@/polyfills';
import * as Sentry from '@sentry/react-native';


export const validateEnv = () => {
    if (!process.env.EXPO_PUBLIC_API_ENDPOINT) {
        throw new Error('Missing required environment variables: EXPO_PUBLIC_API_ENDPOINT ');
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

export const generateKeyPairP256 = async (): Promise<{ publicKey: string; privateKey: string, publicKeyUncompressed: string }> => {
    setupCryptoPolyfill();
    const { generateP256KeyPair } = await import("@turnkey/crypto");
    try {
        const keyPair = generateP256KeyPair();

        return keyPair;
    } catch (e) {
        Sentry.captureException(new Error(`Failed to generate key pair: ${e}. (utils)/auth.ts (generateKeyPairP256)`));
        throw e;
    }
};

export const authenticateUser = async (email: string): Promise<{ otpId: string; mpcPrimaryId: string }> => {
    const request: AuthenticationRequest = {
        email,
        app_name: "Bright",
        app_icon_url: "https://i.imgur.com/WeyHBEn.png",
        expiration: 900
    };
    const easClient = new EasClient();
    const response = await easClient.authenticate(request);

    return {
        otpId: response.data.otp_id,
        mpcPrimaryId: response.data.mpc_primary_id
    };
};

export const verifyOtpCode = async (code: string, otpId: string, suborgId: string): Promise<{ credentialBundle: string; keypair: Keypair, accountInfo: AccountInfo }> => {

    // Generate a new keypair for the request
    const keyPair = await generateKeyPairP256();

    const otpData: OTPData = {
        otp_code: code,
        otp_id: otpId,
        auth_public_key: keyPair.publicKeyUncompressed,
        expiration: 2700, // 45 minutes
        mpc_primary_id: suborgId
    };
    const easClient = new EasClient();
    const response = await easClient.verifyOtp(otpData);

    // Use our generated keypair instead of expecting one from the server
    return {
        credentialBundle: response.data.credential_bundle,
        keypair: keyPair,
        accountInfo: response.data.account_info
    };
};

export const AUTH_STORAGE_KEYS = {
    EMAIL: 'auth_email',
    ACCOUNT_INFO: 'auth_account_info',
    KEYPAIR: 'auth_keypair',
    CREDENTIALS_BUNDLE: 'auth_credentials_bundle',
    WALLET: 'auth_wallet',
    IS_AUTHENTICATED: 'auth_is_authenticated',
    MPC_PRIMARY_ID: 'auth_mpc_primary_id',
    KYC_STATUS: 'auth_kyc_status',
    SMART_ACCOUNT_ADDRESS: 'auth_smart_account_address',
    GRID_USER_ID: 'auth_grid_user_id',
    BRIDGE_KYC_LINK_IDS: 'auth_bridge_kyc_link_id',
    PERSISTENT_EMAIL: 'auth_persistent_email',
    EXTERNAL_ACCOUNTS: 'auth_external_accounts',
    KYC_LINK: 'auth_kyc_link',
    CACHED_BALANCE: 'auth_cached_balance',
};