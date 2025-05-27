import React, { useState, useEffect } from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useKyc } from '@/hooks/useKyc';

const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

interface ReceiveModalProps {
    visible: boolean;
    onClose: () => void;
    onOpenQRCode: () => void;
}

export function ReceiveModal({ visible, onClose, onOpenQRCode }: ReceiveModalProps) {
    const [isBankLoading, setIsBankLoading] = useState(false);
    const { accountInfo } = useAuth();
    const { status, checkStatus } = useKyc();

    const {
        hideAllModals,
        fetchBankDetails,
    } = useModalFlow();

    // Fetch latest KYC and bank details when modal becomes visible
    useEffect(() => {
        const fetchData = async () => {
            setIsBankLoading(true);
            try {
                await checkStatus();

                if (status === 'approved') {
                    await fetchBankDetails();
                }
            } finally {
                setIsBankLoading(false);
            }
        };
        fetchData();
    }, [checkStatus, status, fetchBankDetails]);

    const handleReceiveToWallet = () => {
        hideAllModals();
        onOpenQRCode();
    };

    const handleReceiveFromBank = async () => {
        if (isBankLoading) return;

        setIsBankLoading(true);
        try {
            if (status === 'approved') {
                await fetchBankDetails();
            }

            hideAllModals();
            if (status === 'approved') {
                router.push('/bankdetails');
            } else {
                router.push('/kyc');
            }
        } finally {
            setIsBankLoading(false);
        }
    };

    const isKycPending = status === 'under_review' || status === 'incomplete';
    const isKycRejected = status === 'rejected';

    const getBankDescription = () => {
        if (isBankLoading || !status) {
            return 'Loading...';
        }
        else if (isKycPending) {
            return 'KYC verification in progress';
        }
        else if (isKycRejected) {
            return 'KYC verification failed. Please try again';
        }
        else if (status === 'not_started') {
            return 'Complete KYC to receive via bank transfer';
        }
        else {
            return 'Receive via bank transfer';
        }
    };

    const receiveOptions: ActionOption[] = [
        {
            key: 'wallet',
            title: 'Onchain',
            description: 'Receive via wallet address',
            icon: walletIcon,
            onPress: handleReceiveToWallet,
            disabled: accountInfo?.smart_account_address === null
        },
        {
            key: 'bank',
            title: 'Bank',
            description: getBankDescription(),
            icon: bankIcon,
            onPress: handleReceiveFromBank,
            disabled: isBankLoading || !status || (status !== 'approved' && status !== 'not_started' && status !== 'incomplete')
        }
    ];

    return (
        <ActionModal
            visible={visible}
            onClose={onClose}
            title="Receive"
        >
            <ModalOptionsList options={receiveOptions} />
        </ActionModal>
    );
} 