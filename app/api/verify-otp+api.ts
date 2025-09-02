import { GridClient, GridEnvironment } from '@sqds/grid';

export async function POST(request: Request) {
    console.log("🚀 ~ verify-otp+api.ts")
    try {
        const body = await request.json();

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        
        const response = await gridClient.completeAuth(body);
        console.log("🚀 ~ response:", response)

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