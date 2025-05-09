import React from 'react';
import { ActionModal } from '../ActionModal';
import { ModalOptionsList } from '../../molecules/ModalOptionsList';
import { ActionOption } from '../../molecules/ModalOptionsList';
import { router } from 'expo-router';
import { KycStatus } from '@/types/Kyc';

const bankIcon = require('@/assets/icons/bank.png');
const walletIcon = require('@/assets/icons/wallet.png');

interface ReceiveModalProps {
    visible: boolean;
    onClose: () => void;
    onOpenQRCode: () => void;
    kycStatus: KycStatus;
}

export function ReceiveModal({ visible, onClose, onOpenQRCode, kycStatus }: ReceiveModalProps) {
    const handleReceiveToWallet = () => {
        onClose();
        onOpenQRCode();
    };

    const handleReceiveFromBank = () => {
        onClose();
        if (kycStatus !== 'Approved') {
            router.push('/(modals)/kyc');
        } else {
            router.push('/(modals)/create-bank-account');
        }
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
            description: 'Receive via bank transfer',
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