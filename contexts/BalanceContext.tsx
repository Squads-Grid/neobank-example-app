import React, { createContext, useContext, useState, useEffect } from 'react';

interface BalanceContextType {
    balance: number;
    isLoading: boolean;
    error: Error | null;
    refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBalance = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/balance');

            if (response.status === 404) {
                // Account doesn't exist yet, create it
                await fetch('/api/create-account', { method: 'POST' });
                setBalance(0);
            } else if (response.ok) {
                const data = await response.json();
                setBalance(data.balance);
            } else {
                throw new Error('Failed to fetch balance');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <BalanceContext.Provider value={{ balance, isLoading, error, refreshBalance: fetchBalance }}>
            {children}
        </BalanceContext.Provider>
    );
}

export function useBalance() {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
} 