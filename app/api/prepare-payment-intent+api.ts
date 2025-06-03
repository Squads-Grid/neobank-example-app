import { PreparePaymentIntentParams } from "@/types/Transaction";
import { GridClient } from "@/grid/gridClient";

export async function POST(request: Request) {
    try {
        const { payload, smartAccountAddress, useMpcProvider } = await request.json() as { payload: PreparePaymentIntentParams, smartAccountAddress: string, useMpcProvider: boolean };

        const gridClient = new GridClient();
        const response = await gridClient.preparePaymentIntent(payload, smartAccountAddress, useMpcProvider);

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

