import { SDKGridClient } from '../../grid/sdkClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const gridClient = SDKGridClient.getInstance();

        const payload = {
            otpCode: body.otpCode,
            sessionSecrets: body.sessionSecrets,
            user: body.user
        }
        
        const response = await gridClient.completeAuthAndCreateAccount(payload);

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
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