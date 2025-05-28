import { useState, useCallback, useEffect } from 'react';
import { KycStatus, KycParams } from '@/types/Kyc';
import { easClient } from '@/utils/easClient';
import { StorageService } from '@/utils/storage';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { MockDatabase } from '@/utils/mockDatabase';
import { useModalFlow } from '@/contexts/ModalFlowContext';

interface UseKycReturn {
    status: KycStatus | null;
    isLoading: boolean;
    error: string | null;
    startKyc: (params: KycParams) => Promise<string>;
    checkStatus: () => Promise<void>;
    resetKyc: () => Promise<void>;
    // Bank-specific functionality
    isBankLoading: boolean;
    isKycPending: boolean;
    isKycRejected: boolean;
    getBankDescription: (type: 'send' | 'receive') => string;
    isBankDisabled: boolean;
}

export function useKyc(): UseKycReturn {
    const { accountInfo } = useAuth();
    const [status, setStatus] = useState<KycStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBankLoading, setIsBankLoading] = useState(false);
    const { fetchBankDetails } = useModalFlow();

    // Initialize status from storage when hook mounts
    useEffect(() => {

        checkStatus();
    }, []);

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
            return response.data.kyc_link;
        } catch (err) {
            setError('Failed to start KYC process');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [accountInfo]);

    const checkStatus = useCallback(async () => {
        if (!accountInfo?.grid_user_id) {
            setError('Account information not found');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const user = await MockDatabase.getUser(accountInfo.grid_user_id);
            if (!user) {
                console.log("🚀 ~ checkStatus ~ user not found")
                setStatus('not_started');
                return;
            }

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
            if (newStatus) {
                await StorageService.setItem(AUTH_STORAGE_KEYS.KYC_STATUS, newStatus);
                setStatus(newStatus);

                // If KYC is approved, fetch bank details
                if (newStatus === 'approved') {
                    setIsBankLoading(true);
                    try {
                        await fetchBankDetails();
                    } finally {
                        setIsBankLoading(false);
                    }
                }
            }
        } catch (err) {
            setError('Failed to check KYC status');
        } finally {
            setIsLoading(false);
        }
    }, [accountInfo, fetchBankDetails]);

    const resetKyc = useCallback(async () => {
        if (accountInfo?.grid_user_id) {
            await MockDatabase.deleteUser(accountInfo.grid_user_id);
        }
        await StorageService.deleteItem(AUTH_STORAGE_KEYS.KYC_STATUS);
        setStatus('not_started');
    }, [accountInfo]);

    const isKycPending = status === 'under_review' || status === 'incomplete';
    const isKycRejected = status === 'rejected';

    const getBankDescription = (type: 'send' | 'receive') => {
        if (isLoading || isBankLoading || !status) {
            return 'Loading...';
        }
        else if (isKycPending) {
            return 'KYC verification in progress';
        }
        else if (isKycRejected) {
            return 'KYC verification failed. Please try again';
        }
        else if (status === 'not_started') {
            return `Complete KYC to ${type} via bank transfer`;
        }
        else {
            return type === 'send' ? 'Send USDC to your Bank Account' : 'Receive via bank transfer';
        }
    };

    const isBankDisabled = isLoading || isBankLoading || !status || (status !== 'approved' && status !== 'not_started' && status !== 'incomplete');

    return {
        status,
        isLoading,
        error,
        startKyc,
        checkStatus,
        resetKyc,
        isBankLoading,
        isKycPending,
        isKycRejected,
        getBankDescription,
        isBankDisabled
    };
}