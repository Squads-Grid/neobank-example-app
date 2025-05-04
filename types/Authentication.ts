export interface AuthenticationResponse {
    suborgId: string;
    otpId: string;
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