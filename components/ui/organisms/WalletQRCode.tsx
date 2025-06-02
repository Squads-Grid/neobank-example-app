import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, IconSymbol } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import QRCode from 'react-native-qrcode-svg';
import { useState, useMemo } from 'react';
import * as Clipboard from 'expo-clipboard';

interface WalletQRCodeProps {
    walletAddress: string;
}

export default function WalletQRCode({ walletAddress }: WalletQRCodeProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setString(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    // Memoize the QR code to prevent regeneration on every render
    const qrCode = useMemo(() => (
        <QRCode
            value={walletAddress}
            size={200} // Reduced size for better performance
            color="white"
            backgroundColor="#000033"
            ecl="L" // Lower error correction for better performance
        />
    ), [walletAddress]);

    return (
        <View style={styles.qrCodeContainer}>
            <ThemedText type="large" style={[styles.qrCodeHeadline, { color: 'white' }]}>Bright</ThemedText>
            {qrCode}
            <ThemedText type="default" style={styles.qrCodeAddress}>{walletAddress}</ThemedText>
            <View style={styles.qrCodeSupportContainer}>
                <IconSymbol name="info.circle" size={16} color="white" />
                <ThemedText type="tiny" style={styles.qrCodeSupportText}>We only support USDC.</ThemedText>
            </View>
            <TouchableOpacity
                style={styles.qrCodeCopyContainer}
                onPress={handleCopy}
            >
                <IconSymbol
                    name={copied ? "checkmark.circle" : "doc.on.doc"}
                    size={16}
                    color="white"
                />
                <ThemedText type="regularSemiBold" style={styles.qrCodeCopyText}>
                    {copied ? 'Copied!' : 'Copy'}
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    qrCodeContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-evenly',
    },
    qrCodeHeadline: {
    },
    qrCodeCopyText: {
        color: 'white',
    },
    qrCodeCopyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qrCodeSupportContainer: {
        flexDirection: 'row',
        opacity: 0.4
    },
    qrCodeSupportText: {
        color: 'white',
        marginLeft: Spacing.xs,
        textAlign: 'center',
        paddingVertical: Spacing.xxs,
    },
    qrCodeAddress: {
        color: 'white',
        textAlign: 'center'
    },
})