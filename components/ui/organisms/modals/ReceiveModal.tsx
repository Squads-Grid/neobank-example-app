import React, { useState } from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { router } from 'expo-router';

const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

interface ReceiveModalProps {
    visible: boolean;
    onClose: () => void;
    onOpenQRCode: () => void;
}

export function ReceiveModal({ visible, onClose, onOpenQRCode }: ReceiveModalProps) {
    const [isBankLoading, setIsBankLoading] = useState(false);

    const {
        kycStatus,
        bankAccountDetails,
        hideAllModals,
        fetchKycStatus,
        fetchBankDetails
    } = useModalFlow();

    // Fetch latest KYC and bank details when modal becomes visible
    React.useEffect(() => {
        if (visible) {
            fetchKycStatus();
            if (kycStatus === 'approved') {
                fetchBankDetails();
            }
        }
    }, [visible]);

    const handleReceiveToWallet = () => {
        hideAllModals();
        onOpenQRCode();
    };

    const handleReceiveFromBank = async () => {
        if (isBankLoading) return;

        setIsBankLoading(true);
        try {
            if (kycStatus === 'approved') {
                await Promise.all([fetchKycStatus(), fetchBankDetails()]);
            }

            hideAllModals();
            if (kycStatus === 'approved' && bankAccountDetails && bankAccountDetails.length > 0) {
                console.log('Bank account details are available, showing bank details modal');
                router.push('/bankdetails');
            } else if (kycStatus === 'approved' && !bankAccountDetails) {
                console.log('Bank account details are not available, showing create bank account modal');
                router.push('/create-bank-account');
            } else {
                console.log('KYC status is not approved, showing KYC modal');
                router.push('/kyc');
            }
        } finally {
            setIsBankLoading(false);
        }
    };

    const isKycPending = kycStatus === 'under_review' || kycStatus === 'incomplete';
    const isKycRejected = kycStatus === 'rejected';

    const getBankDescription = () => {
        if (isBankLoading) {
            return 'Loading...';
        }
        if (isKycPending) {
            return 'KYC verification in progress';
        }
        if (isKycRejected) {
            return 'KYC verification failed. Please try again';
        }
        if (kycStatus === 'not_started') {
            return 'Complete KYC to receive via bank transfer';
        }
        return 'Receive via bank transfer';
    };

    const receiveOptions: ActionOption[] = [
        {
            key: 'wallet',
            title: 'Onchain',
            description: 'Receive via wallet address',
            icon: walletIcon,
            onPress: handleReceiveToWallet
        },
        {
            key: 'bank',
            title: 'Bank',
            description: getBankDescription(),
            icon: bankIcon,
            onPress: handleReceiveFromBank,
            disabled: isBankLoading
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