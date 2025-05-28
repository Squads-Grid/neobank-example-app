import React from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { router } from 'expo-router';
import { useKyc } from '@/hooks/useKyc';
import { useModalFlow } from '@/contexts/ModalFlowContext';

const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

interface SendModalProps {
    visible: boolean;
    onClose: () => void;
}

export function SendModal({ visible, onClose }: SendModalProps) {
    const { isBankLoading, getBankDescription, isBankDisabled, status, tosStatus } = useKyc();
    const { hideAllModals } = useModalFlow();


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

        if (status === 'not_started' || status === 'incomplete' || tosStatus === 'pending') {
            hideAllModals();
            router.push({ pathname: '/kyc', params: { source: 'send' } });
            return;
        }

        router.push({
            pathname: '/(send)/fiatamount',
            params: {
                type: 'bank',
                title: 'Send Fiat'
            }
        });
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
            description: getBankDescription('send'),
            icon: bankIcon,
            onPress: handleSendToBank,
            disabled: isBankDisabled
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