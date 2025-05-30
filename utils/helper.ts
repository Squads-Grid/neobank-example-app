import { KycLinkIds } from '@/types/Kyc';
import * as SecureStore from 'expo-secure-store';
import { AUTH_STORAGE_KEYS } from './auth';
import { KycLinkId } from '@/types/Kyc';
import * as Sentry from '@sentry/react-native';

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
        Sentry.captureException(new Error(`Error formatting amount: ${e}. (utils)/helper.ts (formatAmount)`));
        return '$0';
    }
};

export const getKycLinkId = async (gridUserId: string): Promise<string | null> => {
    const bridge_kyc_link_ids = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.BRIDGE_KYC_LINK_IDS);

    if (!bridge_kyc_link_ids) {
        return null;
    }

    const parsedIds = JSON.parse(bridge_kyc_link_ids) as KycLinkIds;
    const kycLinkId = parsedIds.ids.find((id: KycLinkId) => id.grid_user_id === gridUserId)?.kyc_link_id || '';

    return kycLinkId;

};

export const setKycLinkId = async (gridUserId: string, kycLinkId: string) => {
    const bridge_kyc_link_ids = await SecureStore.getItemAsync(AUTH_STORAGE_KEYS.BRIDGE_KYC_LINK_IDS);
    if (!bridge_kyc_link_ids) {
        const parsedIds = {
            ids: [{ grid_user_id: gridUserId, kyc_link_id: kycLinkId }]
        } as KycLinkIds;
        SecureStore.setItemAsync(AUTH_STORAGE_KEYS.BRIDGE_KYC_LINK_IDS, JSON.stringify(parsedIds));
    } else {
        const parsedIds = JSON.parse(bridge_kyc_link_ids) as KycLinkIds;
        parsedIds.ids.push({ grid_user_id: gridUserId, kyc_link_id: kycLinkId });
        SecureStore.setItemAsync(AUTH_STORAGE_KEYS.BRIDGE_KYC_LINK_IDS, JSON.stringify(parsedIds));
    }


};
