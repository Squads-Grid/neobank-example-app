/**
 * Core transaction data interface
 */
export interface Transaction {
    id: string;
    type: string;
    date: string;
    amount: number;
    walletAddress: string;
}

/**
 * Interface for grouped transactions
 */
export interface TransactionGroup {
    title: string;
    data: Transaction[];
}

export interface PrepareTransactionParams {
    smartAccountAddress: string;
    amount: string;
    grid_user_id: string;
    idempotency_key: string;
    source: SmartAccount;
    destination: SmartAccount | SolanaAddress;
}

export interface SmartAccount {
    smart_account_address: string;
    currency: Currency;
}

export interface SolanaAddress {
    address: string;
    currency: Currency;
}

export type Currency =
    | "usd"
    | "eur"
    | "mxn"
    | "usdc"
    | "usdt"
    | "usdb"
    | "dai"
    | "pyusd"
    | "eurc";
