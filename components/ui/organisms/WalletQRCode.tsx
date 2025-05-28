import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText, IconSymbol } from '@/components/ui/atoms';
import { Spacing } from '@/constants/Spacing';
import QRCode from 'react-native-qrcode-svg';
import { useState } from 'react';
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

    const renderQRCode = () => {
        return (
            <QRCode
                value={walletAddress}
                size={250}
                color="white"
                backgroundColor="#000033"
                ecl="H" // Error correction level - H is highest
            />
        );
    }

    return (
        <View style={styles.qrCodeContainer}>
            <ThemedText type="large" style={[styles.qrCodeHeadline, { color: 'white' }]}>Bright</ThemedText>
            {renderQRCode()}
            <ThemedText type="default" style={styles.qrCodeAddress}>{walletAddress}</ThemedText>
            <View style={styles.qrCodeSupportContainer}>
                <IconSymbol name="info.circle" size={16} color="white" />
                <ThemedText type="tiny" style={styles.qrCodeSupportText}>We don't support NFTs.</ThemedText>
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
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    qrCodeHeadline: {
        marginBottom: Spacing.lg
    },
    qrCodeCopyText: {
        color: 'white',
        marginLeft: Spacing.xs
    },
    qrCodeCopyContainer: {
        flexDirection: 'row',
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    qrCodeSupportContainer: {
        flexDirection: 'row',
        marginTop: Spacing.md,
        opacity: 0.4
    },
    qrCodeSupportText: {
        color: 'white',
        marginLeft: Spacing.xxs
    },
    qrCodeAddress: {
        color: 'white',
        marginTop: Spacing.lg,
        textAlign: 'center'
    },
})