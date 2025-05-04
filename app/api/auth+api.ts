// import { APP_CONFIG } from "@/constants/Config";

import { AuthenticationRequest } from "@/types/Authentication";

export async function POST(request: Request) {
    console.log("🚀 ~ POST ~ trying to authenticate user");

    try {
        const body = await request.json() as AuthenticationRequest;
        console.log("🚀 ~ POST ~ body:", body);

        const apiEnpoint = process.env.GRID_ENDPOINT;
        const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
        const apiKey = process.env.GRID_API_KEY;
        const environment = process.env.GRID_ENVIRONMENT ?? "sandbox";

        if (!baseUrl) {
            throw new Error("EXPO_PUBLIC_BASE_URL is not set");
        }

        if (!apiEnpoint) {
            throw new Error("GRID_ENDPOINT is not set");
        }

        if (!apiKey) {
            throw new Error("GRID_API_KEY is not set");
        }

        const response = await fetch(`${baseUrl}${apiEnpoint}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-grid-environment": `${environment}`,
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("💣 Grid authentication error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Failed to authenticate with Grid",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}