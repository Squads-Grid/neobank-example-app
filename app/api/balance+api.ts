import { gridClient } from "@/utils/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const smartAccountAddress = body.smartAccountAddress;
        const response = await gridClient.getBalance(smartAccountAddress);

        return Response.json(response);
    } catch (error) {
        console.error('Error fetching balance:', error);
        return new Response(null, { status: 500 });
    }
} 