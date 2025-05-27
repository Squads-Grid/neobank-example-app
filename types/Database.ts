export interface User {
    grid_user_id: string;
    kyc_link_id: string;
    created_at: string;
    updated_at: string;
}

export interface DatabaseSchema {
    users: User[];
} 