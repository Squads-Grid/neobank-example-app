// import { GridClient } from "@/grid/gridClient";
import { createGridAuth } from "universal-auth/native";

export async function POST(request: Request) {
    console.log("🚀 ~ verify-otp+api.ts")
    try {
        const body = await request.json();

        const gridAuth = createGridAuth({
            apiKey: process.env.GRID_API_KEY,
            environment: 'sandbox'
        })
        gridAuth.addProvider({ provider: 'turnkey' });
        const response = await gridAuth.completeAuth(body);
        console.log("🚀 ~ response:", response)

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