import { OpenVirtualAccountParams } from "@/types/VirtualAccounts";
import { gridClient } from "@/utils/gridClient";

export async function POST(request: Request) {
    try {
        const body = await request.json() as OpenVirtualAccountParams;
        const response = await gridClient.openVirtualAccount(body);

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