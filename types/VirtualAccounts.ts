import { Currency } from "./Transaction";


// TODO: Review what is actually used
export interface OpenVirtualAccountParams {
    smartAccountAddress: string;
    gridUserId: string;
    currency: Currency;
}

// export interface VirtualAccount {
//     id: string;
//     currency: Currency;
//     status: 'active' | 'pending' | 'suspended';
//     source_deposit_instructions: {
//         bank_name: string;
//         bank_account_number: string;
//         bank_beneficiary_name: string;
//         bank_address: string;
//         currency: Currency;
//         routing_number?: string;
//         iban?: string;
//         swift?: string;
//     };
//     created_at: string;
//     updated_at: string;
// }

// export interface VirtualAccountsResponse {
//     virtual_accounts: VirtualAccount[];
// }


