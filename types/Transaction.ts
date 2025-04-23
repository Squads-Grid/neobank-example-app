/**
 * Core transaction data interface
 */
export interface Transaction {
    id: string;
    type: string;
    date: string;
    amount: number;
}

/**
 * Interface for grouped transactions
 */
export interface TransactionGroup {
    title: string;
    data: Transaction[];
}
