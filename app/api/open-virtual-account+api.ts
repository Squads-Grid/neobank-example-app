import { GridClient, GridEnvironment, RequestVirtualAccountRequest } from '@sqds/grid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const virtualAccountRequest: RequestVirtualAccountRequest = {
            currency: body.currency,
            grid_user_id: body.gridUserId
        };

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        const response = await gridClient.requestVirtualAccount(body.smartAccountAddress, virtualAccountRequest);
        console.log("🚀 ~ response in open-virtual-account+api.ts:", response)

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