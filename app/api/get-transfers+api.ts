import { SDKGridClient } from '../../grid/sdkClient';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const smartAccountAddress = searchParams.get('smart_account_address');

        if (!smartAccountAddress) {
            return new Response(JSON.stringify({ error: "smartAccountAddress is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Note: The SDK doesn't currently have a direct method to list payment intents/transfers
        // This functionality may need to be implemented in the SDK or handled differently
        const gridClient = SDKGridClient.getInstance();
        
        const response = await gridClient.getTransfers(smartAccountAddress);

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
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