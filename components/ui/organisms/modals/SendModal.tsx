import React, { useState, useEffect } from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { router } from 'expo-router';
import { useModalFlow } from '@/contexts/ModalFlowContext';
import { useKyc } from '@/hooks/useKyc';

const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

interface SendModalProps {
    visible: boolean;
    onClose: () => void;
}

export function SendModal({ visible, onClose }: SendModalProps) {
    const [isBankLoading, setIsBankLoading] = useState(false);
    const { status: kycStatus, checkStatus } = useKyc();

    // Fetch latest KYC status when modal becomes visible
    useEffect(() => {
        const fetchData = async () => {
            setIsBankLoading(true);
            try {
                await checkStatus();
            } finally {
                setIsBankLoading(false);
            }
        };
        fetchData();
    }, [checkStatus]);

    const handleSendToWallet = () => {
        onClose();
        router.push({
            pathname: '/amount',
            params: {
                type: 'wallet',
                title: 'Send Crypto'
            }
        });
    };

    const handleSendToBank = () => {
        onClose();
        router.push({
            pathname: '/(send)/fiatamount',
            params: {
                type: 'bank',
                title: 'Send Fiat'
            }
        });
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
            return 'Complete KYC to send via bank transfer';
        }
        else {

            return 'Send USDC to your Bank Account';
        }
    };

    const sendOptions: ActionOption[] = [
        {
            key: 'wallet',
            title: 'To Wallet',
            description: 'Send assets to wallet address',
            icon: walletIcon,
            onPress: handleSendToWallet
        },
        {
            key: 'bank',
            title: 'To Bank Account',
            description: getBankDescription(),
            icon: bankIcon,
            onPress: handleSendToBank,
            disabled: isBankLoading || !kycStatus || (kycStatus !== 'approved' && kycStatus !== 'not_started' && kycStatus !== 'incomplete')
        }
    ];

    return (
        <ActionModal
            visible={visible}
            onClose={onClose}
            title="Send"
        >
            <ModalOptionsList options={sendOptions} />
        </ActionModal>
    );
} 