import { GridClient } from "@/grid/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const smartAccountAddress = body.smartAccountAddress;

        const gridClient = new GridClient();
        const response = await gridClient.getBalance(smartAccountAddress);

        return Response.json(response);
    } catch (error) {
        console.error('Error fetching balance:', error);
        return new Response(null, { status: 500 });
    }
} 