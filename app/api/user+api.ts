import { gridClient } from "@/utils/gridClient";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const gridUserId = searchParams.get('id');

        if (!gridUserId) {
            return new Response(JSON.stringify({ error: "gridUserId is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        const response = await gridClient.getUser(gridUserId);
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