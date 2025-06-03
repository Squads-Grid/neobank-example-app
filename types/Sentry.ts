import { z } from "zod/v4";

export const sentryApiResponse = z.object({
    dsn: z.url(),
    sendDefaultPii: z.boolean(),
    replaysSessionSampleRate: z.number(),
    replaysOnErrorSampleRate: z.number()
});

export type SentryApiResponse = z.infer<typeof sentryApiResponse>;
