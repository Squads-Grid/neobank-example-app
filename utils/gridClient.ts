import { AuthenticationRequest, AuthenticationResponse, Keypair, OTPData, VerifyOtpResponse } from '@/types/Auth';
import { CreateSmartAccountRequest, CreateSmartAccountResponse } from '@/types/SmartAccounts';

class GridApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'GridApiError';
    }
}

export class GridClient {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;

    constructor() {
        this.validateEnv();

        this.baseUrl = `${process.env.EXPO_PUBLIC_BASE_URL}${process.env.GRID_ENDPOINT}`;

        this.defaultHeaders = {
            "Content-Type": "application/json",
            "x-grid-environment": `${process.env.GRID_ENV ?? "sandbox"}`,
            "Authorization": `Bearer ${process.env.GRID_API_KEY}`,
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
        const headers = {
            ...this.defaultHeaders,
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new GridApiError(
                    errorData.message || response.statusText,
                    response.status,
                    errorData
                );
            }

            return response.json();
        } catch (error) {
            if (error instanceof GridApiError) {
                throw error;
            }
            throw new GridApiError(
                error instanceof Error ? error.message : 'An unknown error occurred',
                0
            );
        }
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
        console.log("🚀 ~ GridClient ~ createSmartAccount ~ createSmartAccount:")
        return this.request<CreateSmartAccountResponse>('', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }
}

// Create a singleton instance
export const gridClient = new GridClient(); 