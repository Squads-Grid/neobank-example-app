import { gridClient } from "@/utils/gridClient";

export async function POST(request: Request) {
    try {
        console.log("🚀 ~ CREATING SMART ACCOUNT !!!!!!!!!!!!!!!!!!!!!!!!!")
        const body = await request.json();
        const customerId = process.env.GRID_CUSTOMER_ID;
        const response = await gridClient.createSmartAccount({ ...body, grid_customer_id: customerId });
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