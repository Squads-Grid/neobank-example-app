import { useState, useEffect, useCallback } from 'react';
import { TransferResponse } from '@/types/Transaction';
import { EasClient } from '@/utils/easClient';
import { StorageService } from '@/utils/storage';
import { AUTH_STORAGE_KEYS } from '@/utils/auth';
import { AccountInfo } from '@/types/Auth';
import { useAuth } from '@/contexts/AuthContext';

export function useWalletData(accountInfo: AccountInfo | null) {
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [transfers, setTransfers] = useState<TransferResponse>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchWalletData = useCallback(async () => {
        if (!user?.address) {
            setError('Account info not found');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Fetch balance and transactions in parallel
            const easClient = new EasClient();
            const [balanceResult, transfersResult] = await Promise.all([
                easClient.getBalance({ smartAccountAddress: user.address }).then((response) => response),
                easClient.getTransfers(user.address)
            ]);

            // Handle balance
            const balances = balanceResult.data.tokens;
            if (balances.length === 0) {
                setBalance(0);
                await StorageService.setItem(AUTH_STORAGE_KEYS.CACHED_BALANCE, '0');
            } else {
                const usdcAddress = process.env.EXPO_PUBLIC_USDC_MINT_ADDRESS;
                const usdcBalance = balances.find((balance: any) => balance.token_address === usdcAddress);
                if (usdcBalance) {
                    const newBalance = parseFloat(parseFloat(usdcBalance.amount_decimal).toFixed(2));
                    setBalance(newBalance);
                    await StorageService.setItem(AUTH_STORAGE_KEYS.CACHED_BALANCE, newBalance.toString());
                }
            }

            // Handle transfers
            if (transfersResult.data) {
                setTransfers(transfersResult.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
            console.error('Error fetching wallet data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user?.address]);

    // Load cached balance on mount
    useEffect(() => {
        const loadCachedBalance = async () => {
            const cachedBalance = await StorageService.getItem(AUTH_STORAGE_KEYS.CACHED_BALANCE) as string;
            if (cachedBalance) {
                setBalance(parseFloat(cachedBalance));
            }
        };
        loadCachedBalance();
    }, []);

    return {
        balance,
        transfers,
        isLoading,
        error,
        fetchWalletData
    };
}