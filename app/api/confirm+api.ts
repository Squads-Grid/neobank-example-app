import { SDKGridClient } from '../../grid/sdkClient';
import { ErrorCode } from "@/utils/errors";

export async function POST(request: Request) {
    try {
        const { address, signedTransactionPayload } = await request.json();

        const gridClient = SDKGridClient.getInstance();

        // Use signAndSend instead of the old authorize flow
        const signature = await gridClient.send({
            signedTransactionPayload,
            address
        });         

        return new Response(JSON.stringify(signature), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error('Error confirming payment:', error);
        // Check if it's a Turnkey API key expired error
        const errorMessage = error.message || '';
        const errorData = error.data || {};

        if (errorMessage.includes('API_KEY_EXPIRED') || 
        error.message.includes('session key is expired') ||
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