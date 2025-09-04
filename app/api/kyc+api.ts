import { RequestKycLinkRequest } from '@sqds/grid';
import { SDKGridClient } from '../../grid/sdkClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const kycRequest: RequestKycLinkRequest = {
            type: "individual",
            endorsements: [],
            ...body
        }

        const gridClient = SDKGridClient.getInstance();
        const response = await gridClient.requestKycLink(body.smart_account_address, kycRequest);

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