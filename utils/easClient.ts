import { AuthenticationRequest, AuthenticationResponse, Keypair, OTPData, VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { PreparePaymentIntentParams } from '@/types/Transaction';
import { handleError, AppError, ErrorCode } from './errors';
import { KycResponse, KycParams } from '@/types/Kyc';
import { OpenVirtualAccountParams } from '@/types/VirtualAccounts';

class EasError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class EasClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor() {
        this.validateEnv();
        this.baseUrl = `${process.env.EXPO_PUBLIC_API_ENDPOINT}`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    private validateEnv() {
        if (!process.env.EXPO_PUBLIC_API_ENDPOINT) {
            throw new Error('Missing required environment variables: EXPO_PUBLIC_API_ENDPOINT');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        try {
            const url = `${this.baseUrl}${endpoint}`;

            // Only include body for non-GET requests
            const fetchOptions: RequestInit = {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
            };

            if (options.method === 'GET') {
                delete fetchOptions.body;
            }

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Check if errorData has the expected structure
                if (errorData?.details?.[0]?.code) {
                    const code = errorData.details[0].code as ErrorCode;
                    const errorCodesToDisplay = [
                        ErrorCode.OTP_RATE_LIMIT,
                    ];

                    if (errorCodesToDisplay.includes(code as ErrorCode)) {
                        handleError(code, true, true);
                    } else {
                        handleError(code, true, false);
                    }
                }
                throw new EasError('Request failed', response.status, errorData);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof EasError) {
                throw error;
            }
            handleError(ErrorCode.UNKNOWN_ERROR, true, false);
            throw error;
        }
    }

    // Creates an account if it doesn't already exist and triggers otp. If the account already exists, it just triggers otp.
    async authenticate(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        return this.request<AuthenticationResponse>('/auth', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Verifies the otp code and returns the credential bundle.
    async verifyOtp(data: OTPData): Promise<VerifyOtpResponse> {
        return this.request<VerifyOtpResponse>('/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Creates a smart account.
    async createSmartAccount(request: CreateSmartAccountRequest): Promise<CreateSmartAccountResponse> {
        return this.request<CreateSmartAccountResponse>('/create-smart-account', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Gets the balance of a smart account.
    async getBalance(request: { smartAccountAddress: string }): Promise<any> {
        return this.request<[]>('/balance', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Prepares a transaction.
    async preparePaymentIntent(request: any, smartAccountAddress: string, useMpcProvider: boolean = false): Promise<any> {
        return this.request<[]>('/prepare-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ payload: request, smartAccountAddress, useMpcProvider }),
        });
    }

    async getKYCLink(request: KycParams): Promise<KycResponse> {
        return this.request<KycResponse>('/kyc', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async getKYCStatus(smartAccountAddress: string, kycId: string): Promise<any> {
        return this.request<any>(`/kyc-status`, {
            method: 'POST',
            body: JSON.stringify({
                smart_account_address: smartAccountAddress,
                kyc_id: kycId,
            }),
        });
    }

    async getVirtualAccounts(smartAccountAddress: string): Promise<any> {
        return this.request<any>(`/get-virtual-accounts?smart_account_address=${smartAccountAddress}`, {
            method: 'GET',
        });
    }

    async openVirtualAccount(request: OpenVirtualAccountParams): Promise<any> {
        return this.request<any>(`/open-virtual-account`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async getTransfers(smartAccountAddress: string): Promise<any> {
        return this.request<any>(`/get-transfers?smart_account_address=${smartAccountAddress}`, {
            method: 'GET',
        });
    }

    async confirmPaymentIntent(smartAccountAddress: string, paymentIntentId: string, payload?: any, useMpcProvider: boolean = false): Promise<any> {

        return this.request<any>(`/confirm`, {
            method: 'POST',
            body: JSON.stringify({ smartAccountAddress, paymentIntentId, payload, useMpcProvider }),
        });
    }
}

// Create a singleton instance
export const easClient = new EasClient(); 