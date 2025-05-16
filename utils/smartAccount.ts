import { AccountInfo } from "@/types/Auth";
import { easClient } from "./easClient";
import { Permission } from "@/types/SmartAccounts";
import { CreateSmartAccountRequest } from "@/types/SmartAccounts";

export const createSmartAccount = async (accountInfo: AccountInfo) => {

    const request: CreateSmartAccountRequest = {
        policies: {
            authorities: [{
                address: accountInfo.smart_account_signer_public_key,
                permissions: ['CAN_INITIATE', 'CAN_VOTE', 'CAN_EXECUTE'] as Permission[]
            }],
            admin_address: null,
            threshold: 1,
            timelock: null,
        },
        memo: '',
        grid_user_id: null,
        grid_customer_id: null,
        wallet_account: {
            wallet_id: accountInfo.wallet_id,
            wallet_address: accountInfo.smart_account_signer_public_key
        },
        mpc_primary_id: accountInfo.mpc_primary_id
    };

    const response = await easClient.createSmartAccount(request);
    const data = response.data;
    return {
        ...accountInfo,
        smart_account_address: data.smart_account_address,
        grid_user_id: data.grid_user_id
    };
}