import "react-native-get-random-values";
import { TextDecoder, TextEncoder } from "text-encoding";
import "@ethersproject/shims";

export function setupCryptoPolyfill() {
    if (typeof global.crypto === "undefined") {
        global.crypto = {
            getRandomValues: (buffer: Uint8Array) => {
                const bytes = new Uint8Array(buffer.length);
                for (let i = 0; i < buffer.length; i++) {
                    bytes[i] = Math.floor(Math.random() * 256);
                }
                buffer.set(bytes);
                return buffer;
            },
            subtle: {} as any,
            randomUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })
        } as Crypto;
    }
}

// Explicitly setup crypto
if (typeof global.crypto === "undefined") {
    global.crypto = {
        getRandomValues: (buffer: Uint8Array) => {
            const bytes = new Uint8Array(buffer.length);
            for (let i = 0; i < buffer.length; i++) {
                bytes[i] = Math.floor(Math.random() * 256);
            }
            buffer.set(bytes);
            return buffer;
        },
        subtle: {} as any,
        randomUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
    } as Crypto;
}

// https://docs.expo.dev/versions/latest/sdk/gesture-handler/
import "react-native-gesture-handler";

if (__DEV__ && process.env.EXPO_PUBLIC_TRACE_HTTP) {
    let fetch = global.fetch;
    global.fetch = async (input, init) => {
        const before = Date.now();
        const result = await fetch(input, init);
        const after = Date.now();

        return result;
    };
}

if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
    global.TextDecoder = TextDecoder;
}

if (typeof Buffer === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    global.Buffer = require("buffer/").Buffer;
}

if (typeof atob === "undefined") {
    Object.defineProperty(global, "atob", {
        configurable: true,
        enumerable: true,
        get: () =>
            function atob(str: string) {
                return Buffer.from(str, "base64").toString("binary");
            },
    });
}

if (typeof btoa === "undefined") {
    Object.defineProperty(global, "btoa", {
        configurable: true,
        enumerable: true,
        get: () =>
            function btoa(str: string) {
                return Buffer.from(str, "binary").toString("base64");
            },
    });
}
