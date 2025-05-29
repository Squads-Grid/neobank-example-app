import { KycParams, KycRequest } from "@/types/Kyc";
import { gridClient } from "@/grid/gridClient";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const body = await request.json() as KycParams;
        const idempotencyKey = uuidv4(); // TODO: move to client

        const gridCustomerId = process.env.GRID_CUSTOMER_ID;
        if (!gridCustomerId) {
            return new Response(
                JSON.stringify({
                    error: "GRID_CUSTOMER_ID is not set",
                    details: [{ code: "CONFIGURATION_ERROR" }]
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const kycParams: KycRequest = {
            grid_customer_id: gridCustomerId,
            type: "individual",
            endorsements: [],
            ...body
        }

        const response = await gridClient.getKYCLink(kycParams, idempotencyKey);

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