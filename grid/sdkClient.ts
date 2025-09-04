import { GridClient, GridEnvironment } from '@sqds/grid';

let clientInstance: GridClient | null = null;

export class SDKGridClient {
    private static validateBackendEnv() {
        if (!process.env.EXPO_PUBLIC_GRID_ENDPOINT || !process.env.GRID_API_KEY) {
            throw new Error('Missing required backend environment variables: EXPO_PUBLIC_GRID_ENDPOINT and GRID_API_KEY must be set.');
        }
    }

    private static validateFrontendEnv() {
        if (!process.env.EXPO_PUBLIC_GRID_ENDPOINT) {
            throw new Error('Missing required frontend environment variable: EXPO_PUBLIC_GRID_ENDPOINT must be set.');
        }
    }

    private static getEnvironment(): GridEnvironment {
        const gridEnv = process.env.EXPO_PUBLIC_GRID_ENV;
        if (!gridEnv) {
            throw new Error('EXPO_PUBLIC_GRID_ENV environment variable must be set (sandbox or production).');
        }
        if (gridEnv !== 'sandbox' && gridEnv !== 'production') {
            throw new Error('EXPO_PUBLIC_GRID_ENV must be either "sandbox" or "production".');
        }
        return gridEnv as GridEnvironment;
    }

    static getInstance(): GridClient {
        if (!clientInstance) {
            this.validateBackendEnv();
            const environment = this.getEnvironment();
            
            clientInstance = new GridClient({
                apiKey: process.env.GRID_API_KEY!,
                environment,
                baseUrl: process.env.EXPO_PUBLIC_GRID_ENDPOINT!
            });
        }
        return clientInstance;
    }

    static getFrontendClient(): GridClient {
        this.validateFrontendEnv();
        const environment = this.getEnvironment();
        
        return new GridClient({
            environment,
            baseUrl: process.env.EXPO_PUBLIC_GRID_ENDPOINT!
        });
    }

    static cleanup(): void {
        clientInstance = null;
    }
}