export interface User {
    grid_user_id: string;
    email: string;
    kyc_link_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface DatabaseSchema {
    users: User[];
} 