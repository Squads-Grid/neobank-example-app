import { z } from 'zod/v4';

export const Email = z.email();

export interface AuthenticationResponse {
    data: {
        otp_id: string;
        mpc_primary_id: string;
    };
}

export interface AccountInfo {
    mpc_primary_id: string;
    wallet_id: string; // Id of the wallet that has permissions for smart account
    smart_account_signer_public_key: string; // Public key set in the smart account settings
    smart_account_address: string;
    grid_user_id: string;
}

export interface OTPData {
    mpc_primary_id: string;
    otp_id: string;
    otp_code: string;
    auth_public_key: string;
    expiration: number;
}

// export interface AuthenticationRequest {
//     email: string;
//     app_name: string;
//     app_icon_url: string;
//     expiration?: number;
// }

export interface Keypair {
    publicKey: string;
    privateKey: string;
    publicKeyUncompressed: string;
}

export interface AuthContextType {
    isAuthenticated: boolean | null;
    email: string | null;
    accountInfo: AccountInfo | null;
    setEmail: React.Dispatch<React.SetStateAction<string | null>>;
    setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo | null>>;
    keypair: Keypair | null;
    credentialsBundle: string | null;
    authError: string | null;
    authenticate: (email: string) => Promise<string>;
    verifyCode: (code: string, otpId: string) => Promise<boolean>;
    logout: () => Promise<void>;
    wallet: string | null;
    isLoading: boolean;
}

export interface VerifyOtpResponse {
    data: {
        credential_bundle: string;
        // auth_keypair: Keypair;
        account_info: AccountInfo;
    };
} 