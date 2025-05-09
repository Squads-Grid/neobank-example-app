import React from 'react';
import { ActionModal } from '../ActionModal';
import WalletQRCode from '../WalletQRCode';

interface QRCodeModalProps {
    visible: boolean;
    onClose: () => void;
    walletAddress: string;
}

export function QRCodeModal({ visible, onClose, walletAddress }: QRCodeModalProps) {
    return (
        <ActionModal
            visible={visible}
            onClose={onClose}
            useStarburstModal={true}
        >
            <WalletQRCode walletAddress={walletAddress} />
        </ActionModal>
    );
} 