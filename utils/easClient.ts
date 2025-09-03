import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { handleError, ErrorCode } from '@/utils/errors';
import { KycResponse, KycParams } from '@/types/Kyc';
import { OpenVirtualAccountParams } from '@/types/VirtualAccounts';
import { ConfirmPayload } from '@/types/Transaction';
import { SentryApiResponse } from '@/types/Sentry';
import { InitAuthResponse, SessionSecrets } from '@sqds/grid/native';

// import * as Sentry from '@sentry/react-native'; 

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
                const errorData = await response.json().catch(() => console.error('Error parsing response:', response));

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
                // Sentry.captureException(new Error(`EasClient: Request failed: ${errorData}. (utils)/easClient.ts (request) Endpoint: ${endpoint}, Options: ${JSON.stringify(options)}`));
                throw new EasError('EasClient: Request failed', response.status, errorData);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('EasClient: Unexpected error in request():', error);
            // Sentry.captureException(new Error(`EasClient: Unexpected error in request(): ${error}. (utils)/easClient.ts (request) Endpoint: ${endpoint}, Options: ${JSON.stringify(options)}`));
            handleError(ErrorCode.UNKNOWN_ERROR, true, false);
            throw error;
        }
    }

    // Creates an account if it doesn't already exist and triggers otp. If the account already exists, it just triggers otp.
    async authenticate(request: {email: string}): Promise<InitAuthResponse> {
        return this.request<InitAuthResponse>('/auth', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async register(request: {email: string}): Promise<InitAuthResponse> {
        return this.request<InitAuthResponse>('/register', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async verifyCodeAndCreateAccount(request: {otpCode: string, sessionSecrets: SessionSecrets, user: any}): Promise<any> {
        return this.request<InitAuthResponse>('/verify-otp-and-create-account', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async verifyOtpCode(request: {otpCode: string, sessionSecrets: SessionSecrets, user: any}): Promise<any> {
        return this.request<InitAuthResponse>('/verify-otp', {
            method: 'POST',
            body: JSON.stringify(request),
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

    async confirmPaymentIntent(payload?: any): Promise<any> {

        return this.request<any>(`/confirm`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async getSentryConfig(): Promise<SentryApiResponse> {
        return this.request<SentryApiResponse>('/sentry', {
            method: 'GET',
        });
    }
}
