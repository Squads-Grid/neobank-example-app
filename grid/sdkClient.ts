import { GridClient, GridEnvironment } from '@sqds/grid';

let clientInstance: GridClient | null = null;

export class SDKGridClient {
    private static validateEnv() {
        if (!process.env.GRID_ENDPOINT || !process.env.GRID_API_KEY) {
            throw new Error('Missing required environment variables. Please check your .env file.');
        }
    }

    static getInstance(): GridClient {
        if (!clientInstance) {
            this.validateEnv();
            
            // Determine environment from env var
            const gridEnv = process.env.EXPO_PUBLIC_GRID_ENV || 'sandbox';
            const environment: GridEnvironment = gridEnv === 'production' ? 'production' : 'sandbox';
            
            clientInstance = new GridClient({
                apiKey: process.env.GRID_API_KEY!,
                environment,
                baseUrl: process.env.GRID_ENDPOINT!
            });
        }
        return clientInstance;
    }

    static cleanup(): void {
        clientInstance = null;
    }
}