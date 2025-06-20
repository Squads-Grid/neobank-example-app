import { KycParams, KycRequest } from "@/types/Kyc";
import { GridClient } from "@/grid/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json() as KycParams;

        const kycParams: KycRequest = {
            type: "individual",
            endorsements: [],
            ...body
        }

        const gridClient = new GridClient();
        const response = await gridClient.getKYCLink(kycParams);

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