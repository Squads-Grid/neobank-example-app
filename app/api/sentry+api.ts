import { sentryApiResponse } from "@/types/Sentry";

export async function GET() {
    try {
        const response = {
            dsn: process.env.SENTRY_DNS_URL,

            // Adds more context data to events (IP address, cookies, user, etc.)
            // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
            sendDefaultPii: true,

            // Configure Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1,

        }

        const validatedResponse = sentryApiResponse.parse(response);
        return new Response(JSON.stringify(validatedResponse), {
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