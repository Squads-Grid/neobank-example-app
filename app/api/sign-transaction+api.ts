import { gridClient } from "@/utils/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        /**
         * // Send to backend for submission
            const response = await fetch('/api/submit-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [stamp.stampHeaderName]: stamp.stampHeaderValue
                },
                body: JSON.stringify({
                    sub_organization_id: accountInfo.user_id,
                    sign_with: accountInfo.public_key,
                    transaction_message: JSON.stringify(tx)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit transaction');
            }
         */

        const customerId = process.env.GRID_CUSTOMER_ID;
        const response = await gridClient.createSmartAccount({ ...body, grid_customer_id: customerId });
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
        return new Response(
            JSON.stringify({ error: "An unknown error occurred" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}