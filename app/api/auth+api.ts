import { createGridAuth } from "universal-auth/native";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const gridAuth = createGridAuth({
            apiKey: process.env.GRID_API_KEY,
            environment: 'sandbox'
        })
        gridAuth.addProvider({ provider: 'turnkey' });
        const response = await gridAuth.initAuth(body);

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.log("🚀 ~ error:", error)
        // Pass through the error dataar
        return new Response(
            JSON.stringify(error),
            {
                status: error.status || 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}