export type KycStatus = 'not_started' | 'under_review' | 'incomplete' | 'approved' | 'rejected';

export interface KycResponse {
    data: {
        id: string;
        full_name: string;
        email: string;
        type: string;
        kyc_link: string;
        tos_link: string;
        kyc_status: string;
        rejection_reasons: string[];
        tos_status: string;
        created_at: string;
        customer_id: string;
        persona_inquiry_type: string;
    };
    metadata: {
        timestamp: string;
    };
}

export interface KycRequest {
    grid_user_id: string;
    smart_account_address: string;
    type: string;
    email: string;
    full_name: string;
    endorsements: string[];
    redirect_uri: string | null;
}

export interface KycLinkIds {
    ids: KycLinkId[]
}

export interface KycLinkId {
    grid_user_id: string,
    kyc_link_id: string
}

export interface KycParams {
    grid_user_id: string;
    smart_account_address: string;
    email: string;
    full_name: string;
    redirect_uri: string | null;
}

export type TosStatus = 'pending' | 'approved';