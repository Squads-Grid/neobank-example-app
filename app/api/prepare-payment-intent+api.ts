import { PreparePaymentIntentParams } from "@/types/Transaction";
import { gridClient } from "@/utils/gridClient";

export async function POST(request: Request) {
    try {
        const { payload, smartAccountAddress } = await request.json() as { payload: PreparePaymentIntentParams, smartAccountAddress: string };
        console.log("🚀 ~ POST ~ payload:", payload)
        console.log("🚀 ~ POST ~ smartAccountAddress:", smartAccountAddress)

        const response = await gridClient.preparePaymentIntent(payload, smartAccountAddress);

        return Response.json(response);
    } catch (error: any) {
        console.error("Error preparing payment intent:", error)
        // Pass through the error data
        return new Response(
            JSON.stringify(error),
            {
                status: error.status || 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}

