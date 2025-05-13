import { AuthenticationRequest, AuthenticationResponse, OTPData, VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { PrepareTransactionParams } from '@/types/Transaction';
import { UserKycRequest, UserResponse } from '@/types/User';
import { UserKycResponse } from '@/types/Kyc';
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
                const errorData = await response.json().catch(() => ({}));

                // Format the error response
                const error = {
                    message: errorData.message || 'An unknown error occurred',
                    status: response.status,
                    data: {
                        details: errorData.details || [{ code: 'UNKNOWN_ERROR' }]
                    }
                };
                throw error;
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
        return this.request<UserResponse>(`/${request.smartAccountAddress}/transfers`, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': request.idempotency_key
            },
            body: JSON.stringify(request),
        });
    }

    async getKYCLink(request: UserKycRequest, idempotencyKey: string): Promise<UserKycResponse> {
        return this.request<UserKycResponse>(`/${request.smart_account_address}/kyc`, {
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

    async getUser(gridUserId: string): Promise<any> {
        return this.request<any>(`/user/${gridUserId}`, {
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
        return this.request<any>(`/${smartAccountAddress}/transfers`, {
            method: 'GET',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': this.generateIdempotencyKey()
            },
        });
    }
}

// Create a singleton instance
export const gridClient = new GridClient(); 