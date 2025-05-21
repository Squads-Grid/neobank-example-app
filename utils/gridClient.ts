import { AuthenticationRequest, AuthenticationResponse, OTPData, VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { PreparePaymentIntentParams } from '@/types/Transaction';
import { UserResponse } from '@/types/User';
import { KycRequest, KycResponse } from '@/types/Kyc';
import { v4 as uuidv4 } from 'uuid';
import { OpenVirtualAccountParams } from '@/types/VirtualAccounts';

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
            'x-grid-environment': `${process.env.GRID_ENV}`,
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
                // Optionally, try to read error text for debugging
                const errorText = await response.text();
                throw new Error(`Request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }




    generateIdempotencyKey(): string {
        return uuidv4();
    }

    // Auth endpoints
    async authenticate(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        return this.request<AuthenticationResponse>('/auth', {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
            },
            body: JSON.stringify(request),
        });
    }

    async verifyOtp(data: OTPData): Promise<VerifyOtpResponse> {
        return this.request<VerifyOtpResponse>('/verify-otp', {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
            },
            body: JSON.stringify(data),
        });
    }

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
        return this.request<UserResponse>(endpoint, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': this.generateIdempotencyKey()
            },
            body: JSON.stringify(request),
        });
    }

    async getKYCLink(request: KycRequest, idempotencyKey: string): Promise<KycResponse> {
        return this.request<KycResponse>(`/${request.smart_account_address}/kyc`, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': idempotencyKey
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

    async confirmPaymentIntent(smartAccountAddress: string, paymentIntentId: string, payload: string, useMpcProvider: boolean = false): Promise<any> {
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

// Create a singleton instance
export const gridClient = new GridClient(); 