import { useState, useCallback } from 'react';

export function useComingSoonToast() {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState<string>("Coming soon to your region!");

    const showToast = useCallback((customMessage?: string) => {
        if (customMessage) {
            setMessage(customMessage);
        }
        setIsVisible(true);
    }, []);

    const hideToast = useCallback(() => {
        setIsVisible(false);
    }, []);

    return {
        isVisible,
        message,
        showToast,
        hideToast,
    };
} 