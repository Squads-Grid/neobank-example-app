import { AuthenticationRequest, AuthenticationResponse, Keypair, OTPData, VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { PrepareTransactionParams } from '@/types/Transaction';

export class GridClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor() {
        this.validateEnv();
        const url = process.env.EXPO_PUBLIC_BASE_URL || '';
        const endpoint = process.env.GRID_ENDPOINT || '';

        this.baseUrl = `${url}${endpoint}`;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'x-grid-environment': 'sandbox',
            'Authorization': `Bearer ${process.env.GRID_API_KEY}`,
        };
    }

    private validateEnv() {
        if (!process.env.GRID_ENDPOINT || !process.env.EXPO_PUBLIC_BASE_URL || !process.env.GRID_API_KEY) {
            throw new Error('Missing required environment variables. Please check your .env file.');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
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
            // Just pass through the error data from the backend
            throw errorData;
        }

        return response.json();
    }

    // Auth endpoints
    async authenticate(request: AuthenticationRequest): Promise<AuthenticationResponse> {

        return this.request<AuthenticationResponse>('/auth', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    async verifyOtp(data: OTPData): Promise<VerifyOtpResponse> {
        return this.request<VerifyOtpResponse>('/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Creates a smart account.
    async createSmartAccount(request: CreateSmartAccountRequest): Promise<CreateSmartAccountResponse> {
        return this.request<CreateSmartAccountResponse>('', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Prepares a transaction.
    async prepareTransaction(request: PrepareTransactionParams): Promise<any> {
        return this.request<[]>(`/${request.smartAccountAddress}/transfers`, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': request.idempotency_key
            },
            body: JSON.stringify(request),
        });
    }

    async getSmartAccount(smartAccountAddress: string): Promise<any> {
        return this.request<any>(`/${smartAccountAddress}`, {
            method: 'GET',
        });
    }
}

// Create a singleton instance
export const gridClient = new GridClient(); 