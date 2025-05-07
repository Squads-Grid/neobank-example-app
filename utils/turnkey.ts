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
    encodedTx: string; // base64-encoded tx message
    stamper: TurnkeySuborgStamper;
    userOrganizationId: string;
    userPublicKey: string;
}) {
    try {

        const tx = VersionedTransaction.deserialize(
            new Uint8Array(Buffer.from(encodedTx, "base64"))
        );

        const messageBytes = tx.message.serialize();
        const hexPayload = uint8ArrayToHexString(messageBytes);

        const client = new TurnkeyClient(
            { baseUrl: "https://api.turnkey.com" },
            stamper
        );

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

        const signature = uint8ArrayFromHexString(result.r + result.s);

        tx.addSignature(
            new PublicKey(userPublicKey),
            signature
        );

        return Buffer.from(tx.serialize()).toString(
            "base64"
        )
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
            signature,
        };

        return {
            stampHeaderName: "X-Stamp",
            stampHeaderValue: stringToBase64urlString(JSON.stringify(stamp)),
        };
    }

}
