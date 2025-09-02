import { GridClient, GridEnvironment, CreatePaymentIntentRequest } from '@sqds/grid';

export async function POST(request: Request) {
    try {
        const { payload, smartAccountAddress, useMpcProvider } = await request.json() as { payload: CreatePaymentIntentRequest, smartAccountAddress: string, useMpcProvider: boolean };

        const gridClient = new GridClient({
            apiKey: process.env.GRID_API_KEY!,
            environment: 'sandbox' as GridEnvironment,
            baseUrl: process.env.GRID_ENDPOINT || 'http://localhost:50001'
        });
        const response = await gridClient.createPaymentIntent(smartAccountAddress, payload);

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

