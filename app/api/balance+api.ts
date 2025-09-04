import { SDKGridClient } from '../../grid/sdkClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const smartAccountAddress = body.smartAccountAddress;

        const gridClient = SDKGridClient.getInstance();
        const response = await gridClient.getAccountBalances(smartAccountAddress);

        return Response.json(response);
    } catch (error) {
        console.error('Error fetching balance:', error);
        return new Response(null, { status: 500 });
    }
} 