import { UserKycParams, UserKycRequest } from "@/types/User";
import { gridClient } from "@/utils/gridClient";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const body = await request.json() as UserKycParams;
        const idempotencyKey = uuidv4();

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

        const kycParams: UserKycRequest = {
            grid_user_id: body.grid_user_id,
            grid_customer_id: gridCustomerId,
            smart_account_address: body.smart_account_address,
            type: "individual",
            email: body.email,
            full_name: body.full_name,
            endorsements: [],
            redirect_uri: body.redirect_uri,
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