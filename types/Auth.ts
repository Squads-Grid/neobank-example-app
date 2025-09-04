import { UniversalKeyPair } from '@sqds/grid/native';
import { z } from 'zod/v4';

export const Email = z.email();

export interface AccountInfo {
    mpc_primary_id: string;
    wallet_id: string; // Id of the wallet that has permissions for smart account
    smart_account_signer_public_key: string; // Public key set in the smart account settings
    smart_account_address: string;
    grid_user_id: string;
}

export interface AuthContextType {
    isAuthenticated: boolean | null;
    user: any | null;
    email: string | null;
    accountInfo: AccountInfo | null;
    setEmail: React.Dispatch<React.SetStateAction<string | null>>;
    setAccountInfo: React.Dispatch<React.SetStateAction<AccountInfo | null>>;
    keypair: UniversalKeyPair | null;
    credentialsBundle: string | null;
    authError: string | null;
    authenticate: (email: string) => Promise<void>;
    register: (email: string) => Promise<void>;
    verifyCode: (code: string) => Promise<boolean>;
    verifyCodeAndCreateAccount: (code: string) => Promise<boolean>;
    logout: () => Promise<void>;
    wallet: string | null;
    isLoading: boolean;
    isLoggingOut: boolean;
}
