import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

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

    const {
        hideAllModals,
        fetchKycStatus,
        fetchBankDetails,
        kycStatus,
    } = useModalFlow();


    // Fetch latest KYC and bank details when modal becomes visible
    React.useEffect(() => {

        setIsBankLoading(true);

        if (kycStatus === 'approved') {
            fetchBankDetails();
        } else {
            fetchKycStatus();
        }
        setIsBankLoading(false);

    }, []);

    const handleReceiveToWallet = () => {
        hideAllModals();
        onOpenQRCode();
    };

    const handleReceiveFromBank = async () => {
        if (isBankLoading) return;

        setIsBankLoading(true);
        try {
            if (kycStatus === 'approved') {
                await fetchBankDetails();
            }

            hideAllModals();
            if (kycStatus === 'approved') {
                router.push('/bankdetails');
            } else {
                router.push('/kyc');
            }
        } finally {
            setIsBankLoading(false);
        }
    };

    const isKycPending = kycStatus === 'under_review' || kycStatus === 'incomplete';
    const isKycRejected = kycStatus === 'rejected';

    const getBankDescription = () => {
        if (isBankLoading || !kycStatus) {
            return 'Loading...';
        }
        else if (isKycPending) {
            return 'KYC verification in progress';
        }
        else if (isKycRejected) {
            return 'KYC verification failed. Please try again';
        }
        else if (kycStatus === 'not_started') {
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
            disabled: isBankLoading || !kycStatus
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