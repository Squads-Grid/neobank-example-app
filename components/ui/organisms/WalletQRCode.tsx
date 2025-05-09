import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../atoms/ThemedText';
import { IconSymbol } from '../atoms/IconSymbol';
import { AccountInfo } from '@/types/Auth';
import { Spacing } from '@/constants/Spacing';
import QRCode from 'react-native-qrcode-svg';

interface WalletQRCodeProps {
    walletAddress: string;
}

export default function WalletQRCode({ walletAddress }: WalletQRCodeProps) {
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
            <View style={styles.qrCodeCopyContainer}>
                <IconSymbol name="doc.on.doc" size={16} color="white" />
                <ThemedText type="regularSemiBold" style={styles.qrCodeCopyText}>Copy</ThemedText>
            </View>
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