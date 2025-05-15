import { PrepareTransactionParams } from "@/types/Transaction";
import { gridClient } from "@/utils/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json() as PrepareTransactionParams;

        const response = await gridClient.prepareTransaction(body);

        return Response.json(response);
    } catch (error: any) {
        console.error("Error preparing transaction:", error)
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

