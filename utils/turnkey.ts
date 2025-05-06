import { signWithApiKey } from "@turnkey/api-key-stamper";
import { getPublicKey } from "@turnkey/crypto";
import {
    stringToBase64urlString,
    uint8ArrayFromHexString,
    uint8ArrayToHexString,
} from "@turnkey/encoding";

import { VersionedTransaction, PublicKey } from "@solana/web3.js";
import { TurnkeyClient, createActivityPoller } from "@turnkey/http";

export async function signTransactionWithTurnkey({
    encodedTx,
    stamper,
    userOrganizationId,
    userPublicKey,
}: {
    encodedTx: string; // base64-encoded tx
    stamper: TurnkeySuborgStamper;
    userOrganizationId: string;
    userPublicKey: string;
}) {
    try {
        console.log("🚀 ~ signTransactionWithTurnkey ~ encodedTx length:", encodedTx.length);
        // 1. Decode base64 -> VersionedTransaction
        const rawBytes = Buffer.from(encodedTx, "base64");
        console.log("🚀 ~ signTransactionWithTurnkey ~ rawBytes length:", rawBytes.length);
        const transaction = VersionedTransaction.deserialize(new Uint8Array(rawBytes));
        console.log("🚀 ~ signTransactionWithTurnkey ~ transaction deserialized");

        // 2. Serialize the message and convert to hex
        const messageBytes = transaction.message.serialize();
        console.log("🚀 ~ signTransactionWithTurnkey ~ messageBytes length:", messageBytes.length);
        const hexPayload = uint8ArrayToHexString(new Uint8Array(messageBytes));
        console.log("🚀 ~ signTransactionWithTurnkey ~ hexPayload length:", hexPayload.length);

        // 3. Setup Turnkey client
        const client = new TurnkeyClient({ baseUrl: "https://api.turnkey.com" }, stamper);

        // 4. Poll for signRawPayload result
        const poller = createActivityPoller({
            client,
            requestFn: client.signRawPayload,
        });

        const activity = await poller({
            organizationId: userOrganizationId,
            timestampMs: `${Date.now()}`,
            type: "ACTIVITY_TYPE_SIGN_RAW_PAYLOAD_V2",
            parameters: {
                encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
                hashFunction: "HASH_FUNCTION_NOT_APPLICABLE",
                signWith: userPublicKey,
                payload: hexPayload,
            },
        });

        const result = activity.result?.signRawPayloadResult;
        if (!result) {
            throw new Error(`Signing failed, activity ID: ${activity.id}`);
        }

        const sigBytes = uint8ArrayFromHexString(result.r + result.s);
        transaction.addSignature(new PublicKey(userPublicKey), sigBytes);

        // 6. Serialize and return base64
        const signedTx = Buffer.from(transaction.serialize()).toString("base64");
        return signedTx;
    } catch (error) {
        console.error("Error in signTransactionWithTurnkey:", error);
        throw error;
    }
}

export type TStamp = {
    stampHeaderName: string;
    stampHeaderValue: string;
};

export type TurnkeyEmailAuthDetails = {
    subOrganizationId: string;
    email: string;
    publicKey: string;
};

export class TurnkeySuborgStamper {
    constructor(
        private readonly data: string,
        public readonly details: TurnkeyEmailAuthDetails
    ) { }

    async stamp(input: string): Promise<TStamp> {
        const publicKey = uint8ArrayToHexString(
            getPublicKey(uint8ArrayFromHexString(this.data), true)
        );
        const privateKey = this.data;

        const signature = await signWithApiKey({
            content: input,
            publicKey,
            privateKey,
        });

        const stamp = {
            publicKey,
            scheme: "SIGNATURE_SCHEME_TK_API_P256",
            signature: signature,
        };

        return {
            stampHeaderName: "X-Stamp",
            stampHeaderValue: stringToBase64urlString(JSON.stringify(stamp)),
        };
    }
}