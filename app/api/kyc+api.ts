import { GridClient, GridEnvironment, RequestKycLinkRequest } from '@sqds/grid';

export async function POST(request: Request) {
    console.log("🚀 ~ kyc+api.ts")
    try {
        const body = await request.json();

        const kycRequest: RequestKycLinkRequest = {
            type: "individual",
            endorsements: [],
            ...body
        }

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        const response = await gridClient.requestKycLink(body.smart_account_address, kycRequest);
        console.log("🚀 ~ response in kyc+api.ts:", response)

        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error: any) {
        // Format the error response
        const errorResponse = {
            error: error.message || "An unknown error occurred",
            details: error.data?.details || [{ code: "UNKNOWN_ERROR" }],
            status: error.status || 500
        };

        return new Response(
            JSON.stringify(errorResponse),
            {
                status: error.status || 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
} 