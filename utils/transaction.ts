import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    TransactionInstruction,
    VersionedTransaction,
    TransactionMessage,
} from '@solana/web3.js';
import {
    createTransferInstruction,
    createAssociatedTokenAccountIdempotentInstruction,
    getAssociatedTokenAddress
} from '@solana/spl-token';
import { toByteArray, fromByteArray } from 'base64-js';

// USDC mint address (Devnet example; use mainnet address if needed)
const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

export async function createUsdcTransferTx(
    from: String,
    to: String,
    amount: number // amount in USDC (not base units)
): Promise<string> {
    // USDC has 6 decimals
    const amountInBaseUnits = amount * 10 ** 6;

    const fromPublicKey = new PublicKey(from);
    const toPublicKey = new PublicKey(to);

    const connection = new Connection('https://api.devnet.solana.com');

    // Find associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, fromPublicKey);
    const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, toPublicKey);

    // Create transfer instruction
    const transferIx = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPublicKey, // owner
        amountInBaseUnits
    );

    // Get a recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');


    // Create a versioned transaction
    const messageV0 = new TransactionMessage({
        payerKey: fromPublicKey,
        recentBlockhash: blockhash,
        instructions: [
            createAssociatedTokenAccountIdempotentInstruction(
                fromPublicKey,
                toTokenAccount,
                toPublicKey,
                USDC_MINT
            ),
            transferIx]
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    // Serialize and encode the transaction
    const serializedTransaction = transaction.serialize();

    return fromByteArray(new Uint8Array(serializedTransaction));

}