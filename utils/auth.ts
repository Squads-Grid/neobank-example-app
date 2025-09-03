import { AccountInfo } from '@/types/Auth';
import { SessionSecrets } from '@sqds/grid';
import { EasClient } from '@/utils/easClient';
// import { setupCryptoPolyfill } from '@/polyfills';
// import * as Sentry from '@sentry/react-native';


export const validateEnv = () => {
    if (!process.env.EXPO_PUBLIC_API_ENDPOINT) {
        throw new Error('Missing required environment variables: EXPO_PUBLIC_API_ENDPOINT ');
    }
};

/**
 * First time a user registers.
 */
export const registerUser = async (email: string): Promise<any> => {
    const easClient = new EasClient();
    const response = await easClient.register({email: email});
    return response;
};

export const verifyOtpCodeAndCreateAccount = async (code: string, sessionSecrets: SessionSecrets, user: any): Promise<any> => {

    const easClient = new EasClient();
    const response = await easClient.verifyCodeAndCreateAccount({otpCode: code, sessionSecrets: sessionSecrets, user: user});

    // Return the full session secrets array instead of single keypair
    return response;
};

/**
 * existing user logs in.
 */
export const authenticateUser = async (email: string): Promise<any> => {
    const request: {email: string} = {
        email: email,
    };
    const easClient = new EasClient();
    const response = await easClient.authenticate(request);
    return response;
};



export const verifyOtpCode = async (otpCode: string, sessionSecrets: SessionSecrets, user: any): Promise<any> => {

    const easClient = new EasClient();
    const response = await easClient.verifyOtpCode({otpCode, sessionSecrets, user});
    // const response = await easClient.verifyOtp(otpData);

    // Return the full session secrets array instead of single keypair
    return response;
};

export const verifyOtpAndCreateAccount = async (code: string): Promise<void> => {

}

export const AUTH_STORAGE_KEYS = {
    USER: 'auth_user',
    SESSION_SECRETS: 'auth_session_secrets',
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