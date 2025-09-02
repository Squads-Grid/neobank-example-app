import { GridClient, GridEnvironment } from '@sqds/grid';
import { ErrorCode } from "@/utils/errors";

export async function POST(request: Request) {
    try {
        const { smartAccountAddress, paymentIntentId, payload, useMpcProvider } = await request.json();

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        const response = await gridClient.send({
            address: smartAccountAddress,
            signedTransactionPayload: payload
        });

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        // Check if it's a Turnkey API key expired error
        const errorMessage = error.message || '';
        const errorData = error.data || {};

        if (errorMessage.includes('API_KEY_EXPIRED') ||
            (errorData.details && errorData.details.some((detail: any) =>
                detail.turnkeyErrorCode === 'API_KEY_EXPIRED' ||
                detail.message?.includes('expired api key')
            ))) {
            return new Response(
                JSON.stringify({
                    error: 'API key expired',
                    code: ErrorCode.SESSION_EXPIRED,
                    details: [{ code: 'API_KEY_EXPIRED' }]
                }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Pass through other errors
        return new Response(
            JSON.stringify(error),
            {
                status: error.status || 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
} 