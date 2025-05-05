import { AuthenticationRequest, AuthenticationResponse, Keypair, OTPData, VerifyOtpResponse } from '@/types/Auth';

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class ApiClient {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;

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
                throw new ApiError(
                    errorData.message || response.statusText,
                    response.status,
                    errorData
                );
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
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

    // Add more API methods here as needed
    // Example:
    // async getUserProfile(): Promise<UserProfile> {
    //     return this.request<UserProfile>('/user/profile');
    // }
}

// Create a singleton instance
export const apiClient = new ApiClient(); 