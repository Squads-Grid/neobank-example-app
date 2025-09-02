import { StorageService } from './storage';
import { DatabaseSchema, User } from '@/types/Database';

const DB_STORAGE_KEY = 'mock_database';

/**
 * Mock database service that simulates a database using secure storage
 */
export class MockDatabase {
    private static async getDatabase(): Promise<DatabaseSchema> {
        const db = await StorageService.getItem<DatabaseSchema>(DB_STORAGE_KEY);
        if (!db) {
            return { users: [] };
        }
        return db;
    }

    private static async saveDatabase(db: DatabaseSchema): Promise<void> {
        await StorageService.setItem(DB_STORAGE_KEY, db);
    }

    /**
     * Create a new user
     * @param gridUserId - The Grid user ID
     * @param email - The user's email address
     * @param kycLinkId - The KYC link ID
     */
    static async createUser(gridUserId: string, email: string, kycLinkId: string | null = null): Promise<User> {
        const db = await this.getDatabase();

        // Check if user already exists
        const existingUser = db.users.find(u => u.grid_user_id === gridUserId);
        if (existingUser) {
            // if user already exists, update it
            existingUser.email = email; // Update email
            existingUser.updated_at = new Date().toISOString();
            if (kycLinkId) {
                existingUser.kyc_link_id = kycLinkId;
            }
            await this.saveDatabase(db);
            return existingUser;
        }

        const now = new Date().toISOString();
        const newUser: User = {
            grid_user_id: gridUserId,
            email: email,
            kyc_link_id: kycLinkId,
            created_at: now,
            updated_at: now
        };

        db.users.push(newUser);
        await this.saveDatabase(db);
        return newUser;
    }

    /**
     * Get a user by Grid user ID
     * @param gridUserId - The Grid user ID to look up
     */
    static async getUser(gridUserId: string): Promise<User | null> {
        const db = await this.getDatabase();
        return db.users.find(u => u.grid_user_id === gridUserId) || null;
    }

    /**
     * Update a user's KYC link ID
     * @param gridUserId - The Grid user ID
     * @param kycLinkId - The new KYC link ID
     */
    static async updateUserKycLinkID(gridUserId: string, kycLinkId: string | null): Promise<User> {

        const db = await this.getDatabase();
        const userIndex = db.users.findIndex(u => u.grid_user_id === gridUserId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const updatedUser: User = {
            ...db.users[userIndex],
            kyc_link_id: kycLinkId,
            updated_at: new Date().toISOString()
        };

        db.users[userIndex] = updatedUser;
        await this.saveDatabase(db);
        return updatedUser;
    }

    /**
     * Delete a user
     * @param gridUserId - The Grid user ID to delete
     */
    static async deleteUser(gridUserId: string): Promise<void> {
        const db = await this.getDatabase();
        db.users = db.users.filter(u => u.grid_user_id !== gridUserId);
        await this.saveDatabase(db);
    }

    /**
     * List all users
     */
    static async listUsers(): Promise<User[]> {
        const db = await this.getDatabase();
        return db.users;
    }

    /**
     * Clear all data (useful for testing)
     */
    static async clearAll(): Promise<void> {
        await StorageService.deleteItem(DB_STORAGE_KEY);
    }
} 