import { GridClient, GridEnvironment } from '@sqds/grid';

export async function POST(request: Request) {
    console.log("🚀 ~ verify-otp+api.ts")
    try {
        const body = await request.json();
        console.log("🚀 ~ body in api key:", process.env.GRID_API_KEY!)

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        
        console.log("🚀 ~ body in verify-otp+api.ts:", body)
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