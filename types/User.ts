// TODO: change response params to not show third party services
export interface UserResponse {
    user: {
        bridge_customer_id: string | null;
        bridge_kyc_link_id: string | null;
        created_at: string;
        customer_id: string;
        environment: string;
        external_user_id: string | null;
        id: string;
        turnkey_suborg_id: string;
        turnkey_wallet_id: string;
        updated_at: string;
    };
}

export interface UserKycRequest {
    grid_user_id: string;
    grid_customer_id: string;
    type: string;
    email: string;
    full_name: string;
    endorsements: string[];
    redirect_uri: string;
}