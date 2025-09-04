import { RequestVirtualAccountRequest } from '@sqds/grid';
import { SDKGridClient } from '../../grid/sdkClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const virtualAccountRequest: RequestVirtualAccountRequest = {
            currency: body.currency,
            grid_user_id: body.gridUserId
        };

        const gridClient = SDKGridClient.getInstance();
        const response = await gridClient.requestVirtualAccount(body.smartAccountAddress, virtualAccountRequest);

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