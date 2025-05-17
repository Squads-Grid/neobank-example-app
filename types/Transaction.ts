/**
 * Core transaction data interface
 */
export interface Transaction {
    id: string;
    amount: number;
    status: ConfirmationStatus | TransferState;
    type: 'sent' | 'received' | 'regular';
    date: Date;
    address: string;
}

/**
 * Interface for grouped transactions
 */
export interface TransactionGroup {
    title: string;
    data: Transaction[];
}

export interface PreparePaymentIntentParams {
    amount: string;
    grid_user_id: string;
    smartAccountAddress: string;
    source: SmartAccount;
    destination: SmartAccount | SolanaAddress;
    idempotency_key: string;
}

export interface PreparePaymentIntentResponse {
    id: string;
    payment_rail: PaymentRail;
    amount: string;
    currency: Currency;
    source_deposit_instructions?: TransferSourceDepositInstructions;
    source: TransferSource;
    destination: TransferDestination;
    status: TransferState;
    created_at: string;
    updated_at: string;
    completed_at?: string;
    transaction_hash?: string;
    signers_for_threshold?: string[];
    threshold?: number;
    error_message?: string;
    fee?: Fee;
    memo?: string;
    valid_until?: string;
}

export interface SmartAccount {
    smart_account_address: string;
    currency: Currency;
    authorities: string[];
}

export interface SolanaAddress {
    address: string;
    currency: Currency;
}

export type Currency = 'Usd' | 'Eur' | 'Mxn' | 'Usdc' | 'Usdt' | 'Usdb' | 'Dai' | 'Pyusd' | 'Eurc';

export type PaymentRail =
    | 'Ach' | 'AchPush' | 'AchSameDay' | 'Sepa' | 'Swift' | 'Wire'
    | 'Arbitrum' | 'AvalancheCChain' | 'Base' | 'BridgeWallet'
    | 'Ethereum' | 'Optimism' | 'Polygon' | 'Solana' | 'Stellar' | 'Tron';

export type ConfirmationStatus = 'pending' | 'confirmed' | 'failed';

export type TransferState =
    | 'AwaitingFunds'
    | 'InReview'
    | 'FundsReceived'
    | 'PaymentSubmitted'
    | 'PaymentProcessed'
    | 'Canceled'
    | 'Error'
    | 'Undeliverable'
    | 'Returned'
    | 'Refunded';

export interface Fee {
    amount: string;
    currency: Currency;
}

export interface TransferSourceDepositInstructions {
    amount?: string;
    currency: Currency;
    deposit_message?: string;
    payment_rail: PaymentRail;
    from_address?: string;
    to_address?: string;
    bank_name?: string;
    bank_address?: string;
    bank_routing_number?: string;
    bank_account_number?: string;
    bank_beneficiary_name?: string;
    bank_beneficiary_address?: string;
    iban?: string;
    bic?: string;
    account_holder_name?: string;
    blockchain_memo?: string;
    external_account_id?: string;
}

export interface TransferDestination {
    currency: Currency;
    payment_rail: PaymentRail;
    external_account_id?: string;
    bridge_wallet_id?: string;
    from_address?: string;
    wire_message?: string;
    sepa_reference?: string;
    swift_reference?: string;
    swift_charges?: string;
    ach_reference?: string;
    to_address?: string;
    omad?: string;
    imad?: string;
    trace_number?: string;
    uetr?: string;
    blockchain_memo?: string;
}

export interface TransferSource {
    currency: Currency;
    payment_rail: PaymentRail;
    external_account_id?: string;
    bridge_wallet_id?: string;
    from_address?: string;
    wire_message?: string;
    sepa_reference?: string;
    swift_reference?: string;
    swift_charges?: string;
    ach_reference?: string;
    to_address?: string;
    omad?: string;
    imad?: string;
    trace_number?: string;
    uetr?: string;
    blockchain_memo?: string;
}

export interface SplTransfer {
    id: string;
    grid_user_id: string;
    main_account_address: string;
    mint: string;
    is_token_2022: boolean;
    signature: string;
    confirmation_status: ConfirmationStatus;
    from_address: string;
    to_address: string;
    amount: string;
    ui_amount: string;
    decimals: number;
    confirmed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ReturnDetails {
    // Add fields as needed
}

export interface Receipt {
    // Add fields as needed
}

export interface RegularTransfer {
    id: string;
    state: TransferState;
    on_behalf_of: string;
    source_deposit_instructions?: TransferSourceDepositInstructions;
    amount: string;
    client_reference_id?: string;
    currency?: Currency;
    developer_fee: string;
    source: TransferSource;
    destination: TransferDestination;
    receipt: Receipt;
    blockchain_memo?: string;
    return_details?: ReturnDetails;
    created_at: string;
    updated_at: string;
}

export type Transfer = {
    Spl: SplTransfer;
} | {
    Regular: RegularTransfer;
}

export type TransferResponse = Transfer[];
