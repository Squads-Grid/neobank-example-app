import { gridClient } from "@/grid/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await gridClient.verifyOtp(body);

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