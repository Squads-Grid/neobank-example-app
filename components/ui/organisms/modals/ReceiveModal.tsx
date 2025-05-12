import React from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { KycStatus } from '@/types/Kyc';
import { router } from 'expo-router';

const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

interface ReceiveModalProps {
    visible: boolean;
    onClose: () => void;
    onOpenQRCode: () => void;
}

export function ReceiveModal({ visible, onClose, onOpenQRCode }: ReceiveModalProps) {
    const {
        kycStatus,
        bankAccountDetails,
        showKycModal,
        hideAllModals,
        fetchKycStatus,
        fetchBankDetails
    } = useModalFlow();

    // Fetch latest KYC and bank details when modal becomes visible
    React.useEffect(() => {
        if (visible) {
            fetchKycStatus();
            fetchBankDetails();
        }
    }, [visible]);

    const handleReceiveToWallet = () => {
        hideAllModals();
        onOpenQRCode();
    };

    const handleReceiveFromBank = () => {
        console.log('handleReceiveFromBank');
        console.log("🚀 ~ handleReceiveFromBank ~ bankAccountDetails:", bankAccountDetails)

        hideAllModals();
        if (kycStatus !== 'approved') {
            console.log('KYC status is not approved, showing KYC modal');
            router.push('/kyc');
        } else if (bankAccountDetails && bankAccountDetails.length > 0) {

            console.log('Bank account details are available, showing bank details modal');
            router.push('/bankdetails');
        } else {
            console.log('Bank account details are not available, showing create bank account modal');
            router.push('/create-bank-account');
        }
    };

    const isKycPending = kycStatus === 'under_review' || kycStatus === 'incomplete';
    const isKycRejected = kycStatus === 'rejected';

    const getBankDescription = () => {
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
            onPress: handleReceiveFromBank
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