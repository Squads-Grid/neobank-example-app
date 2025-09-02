import { GridClient, GridEnvironment } from '@sqds/grid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const smartAccountAddress = body.smartAccountAddress;

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        const response = await gridClient.getAccountBalances(smartAccountAddress);
        console.log("🚀 ~ response in balance+api.ts:", response)

        return Response.json(response);
    } catch (error) {
        console.error('Error fetching balance:', error);
        return new Response(null, { status: 500 });
    }
} 