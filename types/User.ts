import { z } from 'zod/v4';

export const Email = z.email();

// export interface UserResponse {
//     user: {
//         bridge_customer_id: string | null;
//         bridge_kyc_link_id: string | null;
//         created_at: string;
//         customer_id: string;
//         environment: string;
//         external_user_id: string | null;
//         id: string;
//         mpc_primary_id: string;
//         mpc_primary_wallet_id: string;
//         updated_at: string;
//     };
// }

