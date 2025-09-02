import { GridClient, GridEnvironment } from '@sqds/grid';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const smartAccountAddress = searchParams.get('smart_account_address');

        if (!smartAccountAddress) {
            return new Response(JSON.stringify({ error: "smartAccountAddress is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Note: The SDK doesn't currently have a direct method to list payment intents/transfers
        // This functionality may need to be implemented in the SDK or handled differently
        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        
        // Temporary: return empty array until SDK supports listing payment intents
        const response = { data: [] };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        // Pass through the error data
        return new Response(
            JSON.stringify(error),
            {
                status: error.status || 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
} 