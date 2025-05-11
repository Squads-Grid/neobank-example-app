import { AuthenticationRequest, AuthenticationResponse, Keypair, OTPData, VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';
import { PrepareTransactionParams } from '@/types/Transaction';
import { UserKycRequest, UserResponse } from '@/types/User';
import { UserKycResponse } from '@/types/Kyc';
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
        return this.request<UserResponse>(`/${request.smartAccountAddress}/transfers`, {
            method: 'POST',
            headers: {
                ...this.defaultHeaders,
                'x-idempotency-key': request.idempotency_key
            },
            body: JSON.stringify(request),
        });
    }

    /**
     * curl --location 'http://localhost:50001/api/v0/grid/smart-accounts/3CgNNg1Ug3SLWeFwEsCBC4kGGrLJav3GxeRhHWiNJXCh/kyc' \
--header 'x-grid-environment: production' \
--header 'x-idempotency-key: c64d3cc0-2771-11f0-8569-02d762fb6cd4' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 2295b9dc-c415-406b-a270-4ba3a2e58201' \
--data-raw '{
    "grid_user_id": "62a28937-e904-48a9-85c0-04551bb0eaa1",
    "grid_customer_id": "90f369b4-53ea-466c-9558-01fd6cc1b548",
    "type": "individual",
    "email": "elias@sqds.io",
    "full_name": "Elias Moreno",
    "endorsements": [],
    "redirect_uri": "https://squads.so"
}'
     */

    async getKYCLink(request: UserKycRequest, idempotencyKey: string): Promise<UserKycResponse> {
        return this.request<UserKycResponse>('/kyc', {
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
}

// Create a singleton instance
export const gridClient = new GridClient(); 