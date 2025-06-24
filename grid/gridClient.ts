// import {  VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { ConfirmPayload, PreparePaymentIntentParams } from '@/types/Transaction';
import { KycRequest, KycResponse } from '@/types/Kyc';
import { v4 as uuidv4 } from 'uuid';
import { OpenVirtualAccountParams } from '@/types/VirtualAccounts';
import { TurnkeyInitAuthRequest, InitAuthResponse, TurnkeyCompleteAuthRequest } from 'universal-auth/native';
// import * as Sentry from '@sentry/react-native';

// TODO: USE RESPONSE TYPES NOT ANY

export class GridClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor() {
        this.validateEnv();
        const endpoint = process.env.GRID_ENDPOINT || '';


        this.baseUrl = `${endpoint}`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'x-grid-environment': `${process.env.EXPO_PUBLIC_GRID_ENV}`,
            'Authorization': `Bearer ${process.env.GRID_API_KEY}`,
        };


    }

    private validateEnv() {
        if (!process.env.GRID_ENDPOINT || !process.env.GRID_API_KEY) {
            throw new Error('Missing required environment variables. Please check your .env file.');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => console.error('Error parsing response:', response));

                console.error('Request failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    url,
                    errorData,
                });
                // Sentry.captureException(new Error(`GridClient: Request failed with status ${response.status}: ${errorData}. (grid/gridClient.ts) (request) Endpoint: ${endpoint}, Options: ${JSON.stringify(options)}`));
                throw new Error(`GridClient: Request failed with status ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('GridClient: Unexpected error in request():', error);
            // Sentry.captureException(new Error(`GridClient: Unexpected error in request(): ${error}. (grid/gridClient.ts) (request) Endpoint: ${endpoint}, Options: ${JSON.stringify(options)}`));
            throw error;
        }
    }






    generateIdempotencyKey(): string {
        return uuidv4();
    }

    // // Auth endpoints
    // async authenticate(request: TurnkeyInitAuthRequest): Promise<InitAuthResponse> {
    //     return this.request<InitAuthResponse>('/auth', {
    //         method: 'POST',
    //         headers: {
    //             ...this.defaultHeaders,
    //         },
    //         body: JSON.stringify(request),
    //     });
    // }

    // async verifyOtp(data: TurnkeyCompleteAuthRequest): Promise<VerifyOtpResponse> {
    //     return this.request<VerifyOtpResponse>('/verify-otp', {
    //         method: 'POST',
    //         headers: {
    //             ...this.defaultHeaders,
    //         },
    //         body: JSON.stringify(data),
    //     });
    // }

    // Creates a smart account.
    async createSmartAccount(request: CreateSmartAccountRequest): Promise<CreateSmartAccountResponse> {
        return this.request<CreateSmartAccountResponse>('', {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
            },
            body: JSON.stringify(request),
        });
    }

    // Prepares a transaction.
    async preparePaymentIntent(request: PreparePaymentIntentParams, smartAccountAddress: string, useMpcProvider: boolean = false): Promise<any> {
        const endpoint = useMpcProvider ? `/${smartAccountAddress}/payment-intents?use-mpc-provider=true` : `/${smartAccountAddress}/payment-intents`;
        return this.request<any>(endpoint, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': this.generateIdempotencyKey()
            },
            body: JSON.stringify(request),
        });
    }

    async getKYCLink(request: KycRequest): Promise<KycResponse> {

        return this.request<KycResponse>(`/${request.smart_account_address}/kyc`, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': this.generateIdempotencyKey()
            },
            body: JSON.stringify(request),
        });
    }

    async getSmartAccount(smartAccountAddress: string): Promise<any> {
        return this.request<any>(`/${smartAccountAddress}`, {
            method: 'GET',
        });
    }

    async getKYCStatus(smartAccountAddress: string, kycId: string): Promise<any> {
        return this.request<any>(`/${smartAccountAddress}/kyc/${kycId}`, {
            method: 'GET',
        });
    }

    async getVirtualAccounts(smartAccountAddress: string): Promise<any> {
        return this.request<any>(`/${smartAccountAddress}/virtual-accounts`, {
            method: 'GET',
        });
    }

    async openVirtualAccount(request: OpenVirtualAccountParams): Promise<any> {
        return this.request<any>(`/${request.smartAccountAddress}/virtual-accounts`, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': this.generateIdempotencyKey()
            },
            body: JSON.stringify({
                "currency": request.currency,
                "grid_user_id": request.gridUserId
            }),
        });
    }

    async getTransfers(smartAccountAddress: string): Promise<any> {
        return this.request<any>(`/${smartAccountAddress}/payment-intents`, {
            method: 'GET',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': this.generateIdempotencyKey()
            },
        });
    }

    async getBalance(smartAccountAddress: string): Promise<any> {
        return this.request<any>(`/${smartAccountAddress}/balances`, {
            method: 'GET',
        });
    }

    async confirmPaymentIntent(smartAccountAddress: string, paymentIntentId: string, payload: ConfirmPayload, useMpcProvider: boolean = false): Promise<any> {
        const endpoint = useMpcProvider ? `/${smartAccountAddress}/payment-intents/${paymentIntentId}/confirm?use-mpc-provider=true` : `/${smartAccountAddress}/payment-intents/${paymentIntentId}/confirm`;

        return this.request<any>(endpoint, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
            },
            body: JSON.stringify(payload)

        });
    }
}
