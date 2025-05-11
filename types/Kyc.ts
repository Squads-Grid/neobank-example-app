export type KycStatus = 'NotStarted' | 'UnderReview' | 'Incomplete' | 'Approved' | 'Rejected';

export interface UserKycResponse {
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