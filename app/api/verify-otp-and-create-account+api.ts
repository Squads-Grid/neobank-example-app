import { GridClient, GridEnvironment } from '@sqds/grid';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("🚀 ~ body in verify-otp-and-create-account+api.ts:", body)

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });

        const payload = {
            otpCode: body.otpCode,
            sessionSecrets: body.sessionSecrets,
            user: body.user
        }
        console.log("🚀 ~ payload in verify-otp-and-create-account+api.ts:", payload)
        
        const response = await gridClient.completeAuthAndCreateAccount(payload);
        console.log("🚀 ~ response in verifyAndCreateAccount+api.ts:", response)

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.log("🚀 ~ error:", error)
        // Pass through the error dataar
        return new Response(
            JSON.stringify(error),
            {
                status: error.status || 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}