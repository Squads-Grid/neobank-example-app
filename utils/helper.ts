import { setupCryptoPolyfill } from '@/polyfills';

/**
 * Format a string amount as a currency string
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatAmount = (amount: string) => {
    try {
        return parseFloat(amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount.includes('.') ? 2 : 0,
            maximumFractionDigits: 2
        });
    } catch (e) {
        return '$0';
    }
};

export const generateKeyPairP256 = async (): Promise<{ publicKey: string; privateKey: string, publicKeyUncompressed: string }> => {
    setupCryptoPolyfill();
    const { generateP256KeyPair } = await import("@turnkey/crypto");
    try {
        const keyPair = generateP256KeyPair();

        return keyPair;
    } catch (e) {
        throw e;
    }
};
