import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/(auth)/start');
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading || !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
} 