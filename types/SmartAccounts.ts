export type Permission = 'CAN_INITIATE' | 'CAN_VOTE' | 'CAN_EXECUTE';

export interface Signer {
    address: string;
    permissions: Permission[];
}

export interface Policies {
    signers: Signer[];
    admin_address: string | null;
    threshold: number;
}

export interface CreateSmartAccountRequest {
    policies: Policies;
    memo: string;
    grid_user_id: string | null;
    wallet_account: WalletAccount | null;
    user_id: string;
}

export interface SmartAccountData {
    smart_account_address: string;
    grid_user_id: string;
    policies: Policies;
    created_at: string;
}

export interface SmartAccountMetadata {
    timestamp: string;
}

export interface CreateSmartAccountResponse {
    data: SmartAccountData;
    metadata: SmartAccountMetadata;
}

export interface WalletAccount {
    wallet_id: string;
    wallet_address: string;
}

export interface TokenBalance {
    amount: number;
    amount_decimal: string;
    decimals: number;
    logo_url: string | null;
    name: string | null;
    symbol: string | null;
    token_address: string;
}

export interface BalanceResponse {
    balances: TokenBalance[];
}
