import React from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { router } from 'expo-router';

const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

interface SendModalProps {
    visible: boolean;
    onClose: () => void;
}

export function SendModal({ visible, onClose }: SendModalProps) {
    const handleSendToWallet = () => {
        onClose();
        router.push({
            pathname: '/amount',
            params: {
                type: 'wallet',
                title: 'Send'
            }
        });
    };

    const handleSendToBank = () => {
        onClose();
        router.push({
            pathname: '/(send)/amount',
            params: {
                type: 'bank',
                title: 'Send'
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
            description: 'Send USDC to Bank Account',
            icon: bankIcon,
            onPress: handleSendToBank
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