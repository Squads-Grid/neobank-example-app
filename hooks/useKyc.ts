import { useState, useCallback, useEffect } from 'react';
import { KycStatus, KycParams, TosStatus } from '@/types/Kyc';
import { EasClient } from '@/utils/easClient';
import { StorageService } from '@/utils/storage';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { MockDatabase } from '@/utils/mockDatabase';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import * as Sentry from '@sentry/react-native';

interface UseKycReturn {
    status: KycStatus | null;
    tosStatus: TosStatus | null;
    isLoading: boolean;
    error: string | null;
    startKyc: (params: KycParams) => Promise<{ kycLink: string; tosLink: string }>;
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
    const [status, setStatus] = useState<KycStatus | null>(null);
    const [tosStatus, setTosStatus] = useState<TosStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBankLoading, setIsBankLoading] = useState(false);
    const { fetchBankDetails } = useModalFlow();
    const { user } = useAuth();

    // Initialize status from storage when hook mounts
    useEffect(() => {

        checkStatus();
    }, []);

    const startKyc = useCallback(async (params: KycParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const easClient = new EasClient();
            const response = await easClient.getKYCLink(params);

            StorageService.setItem(AUTH_STORAGE_KEYS.KYC_STATUS, response.data.kyc_status);

            if (!user?.grid_user_id) {
                throw new Error('Account information not found');
            }

            // Store the KYC link ID in the mock database
            await MockDatabase.updateUserKycLinkID(user.grid_user_id, response.data.id);
            return { kycLink: response.data.kyc_link, tosLink: response.data.tos_link };
            
        } catch (err) {
            Sentry.captureException(new Error(`Failed to start KYC process: ${err}. (hooks)/useKyc.ts (startKyc)`));
            setError('Failed to start KYC process');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const checkStatus = useCallback(async () => {
        if (!user?.grid_user_id) {
            setError('Account information not found');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const userData = await MockDatabase.getUser(user.grid_user_id);
            if (!userData) {
                setStatus('not_started');
                setIsLoading(false);
                return;
            }

            if (!userData?.kyc_link_id) {
                setStatus('not_started');
                setIsLoading(false);
                return;
            }
            if (!user.address) {
                setError('Account information not found');
                setIsLoading(false);

                return;
            }
            const easClient = new EasClient();
            const response = await easClient.getKYCStatus(user.address, userData.kyc_link_id);

            const tosStatus = process.env.EXPO_PUBLIC_GRID_ENV === 'production' ? response.data.tos_status as TosStatus : 'approved';
            const newStatus = response.data.status as KycStatus;
            if (newStatus) {
                await StorageService.setItem(AUTH_STORAGE_KEYS.KYC_STATUS, newStatus);
                setStatus(newStatus);
                setTosStatus(tosStatus);

                if (newStatus === 'approved' && tosStatus === 'approved') {
                    setIsBankLoading(true);
                    try {
                        await fetchBankDetails();
                    } finally {
                        setIsBankLoading(false);
                    }
                }
            }
        } catch (err) {
            Sentry.captureException(new Error(`Failed to check KYC status: ${err}. (hooks)/useKyc.ts (checkStatus)`));
            setError('Failed to check KYC status');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [user, fetchBankDetails]);

    const resetKyc = useCallback(async () => {
        if (user?.grid_user_id) {
            await MockDatabase.deleteUser(user.grid_user_id);
        }
        await StorageService.deleteItem(AUTH_STORAGE_KEYS.KYC_STATUS);
        setStatus('not_started');
    }, [user]);

    const isKycPending = status === 'under_review';
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
        else if (status === 'not_started' || status === 'incomplete' || tosStatus === 'pending') {
            return `Complete KYC to ${type} via bank transfer`;
        }
        else {
            return type === 'send' ? 'Send USDC to your Bank Account' : 'Receive via bank transfer';
        }
    };

    const isBankDisabled = isLoading || isBankLoading || !status || (status !== 'approved' && status !== 'not_started' && status !== 'incomplete');

    return {
        status,
        tosStatus,
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