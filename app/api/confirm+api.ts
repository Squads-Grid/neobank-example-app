import { gridClient } from "@/utils/gridClient";
import { ErrorCode } from "@/utils/errors";

export async function POST(request: Request) {
    try {
        const { smartAccountAddress, paymentIntentId, payload, useMpcProvider } = await request.json();
        const response = await gridClient.confirmPaymentIntent(smartAccountAddress, paymentIntentId, payload, useMpcProvider);

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