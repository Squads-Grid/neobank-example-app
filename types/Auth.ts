export interface AuthenticationResponse {
    data: {
        otp_id: string;
        suborg_info: SuborgInfo;
    };
}

export interface SuborgInfo {
    sub_organization_id: string;
    wallet_id: string;
    public_key: string;
}

export interface OTPData {
    sub_organization_id: string;
    otp_id: string;
    otp_code: string;
    public_key: string;
    expiration: number;
}

export interface AuthenticationRequest {
    email: string;
    app_name: string;
    app_icon_url: string;
    expiration?: number;
}

export interface Keypair {
    publicKey: string;
    privateKey: string;
    publicKeyUncompressed: string;
}

export interface AuthContextType {
    isAuthenticated: boolean | null;
    email: string | null;
    suborgInfo: SuborgInfo | null;
    setEmail: React.Dispatch<React.SetStateAction<string | null>>;
    keypair: Keypair | null;
    credentialsBundle: string | null;
    authError: string | null;
    authenticate: (email: string) => Promise<string>;
    verifyCode: (code: string, otpId: string) => Promise<boolean>;
    logout: () => Promise<void>;
    wallet: string | null;
}

export interface AuthResponse {
    data: {
        otp_id: string;
        sub_organization_id: string;
    };
}

export interface VerifyOtpResponse {
    data: {
        credential_bundle: string;
        keypair: Keypair;
    };
} 