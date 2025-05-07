

import { PrepareTransactionParams } from "@/types/Transaction";
import { gridClient } from "@/utils/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json() as PrepareTransactionParams;
        const {
            smartAccountAddress,
            amount,
            grid_user_id,
            idempotency_key,
            source,
            destination
        } = body;

        // const url = `${process.env.EXPO_PUBLIC_BASE_URL}:50001/api/v0/grid/smart-accounts/${smartAccountAddress}/transfers`;

        const response = await gridClient.prepareTransaction({
            smartAccountAddress,
            amount,
            grid_user_id,
            idempotency_key,
            source,
            destination
        });
        // const response = await fetch(
        //     url,
        //     {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Bearer ${process.env.GRID_API_KEY}`,
        //             'Content-Type': 'application/json',
        //             'x-squads-network': 'sandbox',
        //             'x-idempotency-key': idempotency_key
        //         },
        //         body: JSON.stringify({
        //             amount,
        //             grid_user_id,
        //             idempotency_key,
        //             source,
        //             destination

        //         })
        //     }
        // );
        return Response.json(response);
    } catch (error) {
        console.error('Error preparing transaction:', error);
        return new Response(null, { status: 500 });
    }
}

