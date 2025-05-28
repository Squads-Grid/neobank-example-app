import React from 'react';
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
    const { accountInfo } = useAuth();
    const { hideAllModals } = useModalFlow();
    const { isBankLoading, getBankDescription, isBankDisabled, status, tosStatus } = useKyc();

    const handleReceiveToWallet = () => {
        hideAllModals();
        onOpenQRCode();
    };

    const handleReceiveFromBank = async () => {
        if (isBankLoading) return;

        if (status === 'not_started' || status === 'incomplete' || tosStatus === 'pending') {
            hideAllModals();
            router.push({ pathname: '/kyc', params: { source: 'receive' } });
            return;
        }

        hideAllModals();
        router.push('/bankdetails');
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
            description: getBankDescription('receive'),
            icon: bankIcon,
            onPress: handleReceiveFromBank,
            disabled: isBankDisabled
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