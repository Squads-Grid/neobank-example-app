import { useState, useCallback, useMemo } from 'react';
import { easClient } from '@/utils/easClient';
import { useAuth } from '@/contexts/AuthContext';

export function useVirtualAccount() {
    const { accountInfo } = useAuth();
    const [virtualAccounts, setVirtualAccounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<null | Error>(null);

    const fetch = useCallback(async () => {
        if (!accountInfo?.smart_account_address) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await easClient.getVirtualAccounts(accountInfo.smart_account_address);
            setVirtualAccounts(response.data.virtual_accounts || []);
        } catch (err: any) {
            setError(err);
            console.error('Failed to fetch virtual accounts:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accountInfo]);

    const create = useCallback(async () => {
        if (!accountInfo?.smart_account_address || !accountInfo?.grid_user_id) return;
        setIsLoading(true);
        setError(null);
        try {
            // const response = await easClient.createVirtualAccount({
            //     smart_account_address: accountInfo.smart_account_address,
            //     grid_user_id: accountInfo.grid_user_id,
            //     currency: 'usd',
            // });
            // await fetch(); // re-fetch after creation
            // return response.data;
        } catch (err: any) {
            setError(err);
            console.error('Failed to create virtual account:', err);
        } finally {
            setIsLoading(false);
        }
    }, [accountInfo, fetch]);

    const hasVirtualAccount = useMemo(() => {
        return virtualAccounts.length > 0;
    }, [virtualAccounts]);

    return {
        virtualAccounts,
        hasVirtualAccount,
        isLoading,
        error,
        fetch,
        create,
    };
}