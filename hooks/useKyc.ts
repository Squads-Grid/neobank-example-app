import { useState, useCallback } from 'react';
import { KycStatus, KycParams } from '@/types/Kyc';
import { easClient } from '@/utils/easClient';
import { StorageService } from '@/utils/storage';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { MockDatabase } from '@/utils/mockDatabase';

interface UseKycReturn {
    status: KycStatus | null;
    isLoading: boolean;
    error: string | null;
    startKyc: (params: KycParams) => Promise<string>;
    checkStatus: () => Promise<void>;
    resetKyc: () => Promise<void>;
}

export function useKyc(): UseKycReturn {
    const { accountInfo } = useAuth();
    const [status, setStatus] = useState<KycStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startKyc = useCallback(async (params: KycParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await easClient.getKYCLink(params);
            if (!accountInfo?.grid_user_id) {
                throw new Error('Account information not found');
            }
            // Store the KYC link ID in the mock database
            await MockDatabase.updateUserKycLinkID(accountInfo.grid_user_id, response.data.id);
            await StorageService.setItem(AUTH_STORAGE_KEYS.KYC_STATUS, 'incomplete');
            setStatus('incomplete');
            return response.data.kyc_link;
        } catch (err) {
            setError('Failed to start KYC process');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [accountInfo]);


    const checkStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (!accountInfo?.grid_user_id) {
                setError('Account information not found');

                return;
            }

            const user = await MockDatabase.getUser(accountInfo.grid_user_id);
            if (!user?.kyc_link_id) {
                setStatus('not_started');
                return;
            }

            if (!accountInfo.smart_account_address) {
                setError('Account information not found');
                return;
            }

            const response = await easClient.getKYCStatus(accountInfo.smart_account_address, user.kyc_link_id);
            const newStatus = response.data.status as KycStatus;
            await StorageService.setItem(AUTH_STORAGE_KEYS.KYC_STATUS, newStatus);
            setStatus(newStatus);
        } catch (err) {
            setError('Failed to check KYC status');
        } finally {
            setIsLoading(false);
        }
    }, [accountInfo]);

    const resetKyc = useCallback(async () => {
        if (accountInfo?.grid_user_id) {
            await MockDatabase.deleteUser(accountInfo.grid_user_id);
        }
        await StorageService.deleteItem(AUTH_STORAGE_KEYS.KYC_STATUS);
        setStatus('not_started');
    }, [accountInfo]);

    return {
        status,
        isLoading,
        error,
        startKyc,
        checkStatus,
        resetKyc
    };
}