import React, { createContext, useContext, useState, useCallback } from 'react';
import { KycStatus, KycLinkIds, KycLinkId } from '@/types/Kyc';
import { EasClient } from '@/utils/easClient';
import { useAuth } from './AuthContext';
import { Currency } from '@/types/Transaction';
import * as SecureStore from 'expo-secure-store';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { MockDatabase } from '@/utils/mockDatabase';
import * as Sentry from '@sentry/react-native';

interface BankAccountDetails {
    currency: Currency;
    accountNumber: string;
    routingNumber?: string;
    iban?: string;
    swift?: string;
    bank_name: string;
    beneficiaryName: string;
    bankAddress: string;
}

interface ModalFlowContextType {
    // Modal visibility states
    isReceiveModalVisible: boolean;
    isBankDetailsModalVisible: boolean;
    isCreateBankAccountModalVisible: boolean;
    isKycModalVisible: boolean;

    // Shared data
    selectedCurrency: Currency;
    kycStatus: KycStatus | null;
    setKycStatus: (status: KycStatus) => void;
    bankAccountDetails: any[] | null; // TODO: define type
    isLoading: boolean;
    error: string | null;

    // Actions
    showReceiveModal: () => void;
    showBankDetailsModal: () => void;
    showCreateBankAccountModal: () => void;
    showKycModal: () => void;
    hideAllModals: () => void;

    // Data actions
    setSelectedCurrency: (currency: Currency) => void;
    fetchBankDetails: () => Promise<void>;
    fetchKycStatus: () => Promise<void>;
}

const ModalFlowContext = createContext<ModalFlowContextType | undefined>(undefined);

export function ModalFlowProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // Modal visibility states
    const [isReceiveModalVisible, setIsReceiveModalVisible] = useState(false);
    const [isBankDetailsModalVisible, setIsBankDetailsModalVisible] = useState(false);
    const [isCreateBankAccountModalVisible, setIsCreateBankAccountModalVisible] = useState(false);
    const [isKycModalVisible, setIsKycModalVisible] = useState(false);

    // Shared data
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>('usd');
    const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);
    const [bankAccountDetails, setBankAccountDetails] = useState<BankAccountDetails[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal actions
    const showReceiveModal = useCallback(() => {
        setIsReceiveModalVisible(true);
    }, []);

    const showBankDetailsModal = useCallback(() => {
        setIsBankDetailsModalVisible(true);
    }, []);

    const showCreateBankAccountModal = useCallback(() => {
        setIsCreateBankAccountModalVisible(true);
    }, []);

    const showKycModal = useCallback(() => {
        setIsKycModalVisible(true);
    }, []);

    const hideAllModals = useCallback(() => {
        setIsReceiveModalVisible(false);
        setIsBankDetailsModalVisible(false);
        setIsCreateBankAccountModalVisible(false);
        setIsKycModalVisible(false);
    }, []);

    // Data fetching methods
    const fetchBankDetails = useCallback(async () => {
        if (!user?.address) return;

        setIsLoading(true);
        setError(null);

        try {
            const easClient = new EasClient();
            const response = await easClient.getVirtualAccounts(user.address);
            setBankAccountDetails(response);
        } catch (err) {
            setError('Failed to fetch bank details');
            console.error('Error fetching bank details:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user?.address]);

    const fetchKycStatus = useCallback(async () => {
        if (!user?.address || !user?.grid_user_id) return;

        setIsLoading(true);
        setError(null);

        try {
            const userData = await MockDatabase.getUser(user.grid_user_id);
            const kycLinkId = userData?.kyc_link_id;
            if (!kycLinkId) {
                setKycStatus('not_started');
                return;
            }

            const easClient = new EasClient();
            const kycResponse = await easClient.getKYCStatus(
                user.address,
                kycLinkId
            );

            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.KYC_STATUS, kycResponse.data.status);
            SecureStore.setItemAsync(AUTH_STORAGE_KEYS.KYC_LINK, kycResponse.data.kyc_continuation_link);
            setKycStatus(kycResponse.data.status);
        } catch (err) {
            Sentry.captureException(new Error(`Failed to fetch KYC status: ${err}. (contexts)/ModalFlowContext.tsx (fetchKycStatus)`));
            setError('Failed to fetch KYC status');
            console.error('Error fetching KYC status:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user?.address, user?.grid_user_id]);


    const value = {
        // Modal visibility states
        isReceiveModalVisible,
        isBankDetailsModalVisible,
        isCreateBankAccountModalVisible,
        isKycModalVisible,

        // Shared data
        selectedCurrency,
        kycStatus,
        setKycStatus,
        bankAccountDetails,
        isLoading,
        error,

        // Actions
        showReceiveModal,
        showBankDetailsModal,
        showCreateBankAccountModal,
        showKycModal,
        hideAllModals,

        // Data actions
        setSelectedCurrency,
        fetchBankDetails,
        fetchKycStatus,
    };

    return (
        <ModalFlowContext.Provider value={value}>
            {children}
        </ModalFlowContext.Provider>
    );
}

export function useModalFlow() {
    const context = useContext(ModalFlowContext);
    if (context === undefined) {
        Sentry.captureException(new Error(`useModalFlow must be used within a ModalFlowProvider. (contexts)/ModalFlowContext.tsx (useModalFlow)`));
        throw new Error('useModalFlow must be used within a ModalFlowProvider');
    }
    return context;
} 