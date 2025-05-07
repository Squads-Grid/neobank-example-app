import { AuthenticationRequest, AuthenticationResponse, Keypair, OTPData, VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { PrepareTransactionParams } from '@/types/Transaction';
import { handleError, AppError, ErrorCode } from './errors';

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
        this.baseUrl = `${process.env.EXPO_PUBLIC_BASE_URL}${process.env.EXPO_PUBLIC_API_ENDPOINT}`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    private validateEnv() {
        if (!process.env.EXPO_PUBLIC_BASE_URL || !process.env.EXPO_PUBLIC_API_ENDPOINT) {
            throw new Error('Missing required environment variables: EXPO_PUBLIC_BASE_URL and EXPO_PUBLIC_API_ENDPOINT');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        try {
            const url = `${this.baseUrl}${endpoint}`;

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                const code = errorData.details[0].code as ErrorCode;
                const errorCodesToDisplay = [
                    ErrorCode.OTP_RATE_LIMIT,
                ];

                if (errorCodesToDisplay.includes(code as ErrorCode)) {
                    handleError(code, true, true);
                } else {
                    handleError(code, true, false);
                }
                throw new EasError('Request failed', response.status, errorData);
            }

            return response.json();
        } catch (error) {
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
    async prepareTransaction(request: PrepareTransactionParams): Promise<any> {
        return this.request<[]>('/prepare-transaction', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }
}

// Create a singleton instance
export const easClient = new EasClient(); 