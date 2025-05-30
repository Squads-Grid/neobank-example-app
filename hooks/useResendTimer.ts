import { useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/react-native';

interface UseResendTimerProps {
    initialSeconds?: number;
    onResend: () => Promise<void>;
}

export function useResendTimer({ initialSeconds = 30, onResend }: UseResendTimerProps) {
    const [countdown, setCountdown] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        let timer: number;

        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsDisabled(false);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [countdown]);

    const handleResend = useCallback(async () => {
        try {
            setIsDisabled(true);
            await onResend();
            setCountdown(initialSeconds);
        } catch (error) {
            Sentry.captureException(new Error(`Failed to resend code: ${error}. (hooks)/useResendTimer.ts (handleResend)`));
            // If the resend fails, enable the button again
            setIsDisabled(false);
            // You might want to handle the error (show toast, etc.)
            console.error('Failed to resend code:', error);
        }
    }, [initialSeconds, onResend]);

    return {
        countdown: countdown > 0 ? countdown : undefined,
        isDisabled,
        handleResend
    };
} 