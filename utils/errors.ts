import Toast from 'react-native-toast-message';

export enum ErrorCode {
    // Authentication errors
    AUTH_FAILED = 'AUTH_FAILED',
    INVALID_OTP = 'INVALID_OTP',
    OTP_EXPIRED = 'OTP_EXPIRED',
    TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
    SESSION_EXPIRED = 'SESSION_EXPIRED',

    // Transaction errors
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
    INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',

    // Network errors
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',

}

// Error messages that can be displayed to the user
export const ErrorMessages: Record<ErrorCode, string> = {
    // Authentication errors
    [ErrorCode.AUTH_FAILED]: 'Authentication failed. Please try again.',
    [ErrorCode.INVALID_OTP]: 'Invalid OTP. Please try again.',
    [ErrorCode.OTP_EXPIRED]: 'OTP expired. Please request a new one.',
    [ErrorCode.TOO_MANY_ATTEMPTS]: 'Too many attempts. Please try again later.',
    [ErrorCode.SESSION_EXPIRED]: 'Session expired. Please log in again.',

    // Transaction errors
    [ErrorCode.INSUFFICIENT_BALANCE]: 'Insufficient balance. Please add more funds.',
    [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds. Please add more funds.',

    // Network errors
    [ErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred. Please try again later.',

}


export class AppError extends Error {
    constructor(
        public code: ErrorCode,
        public shouldLog: boolean = true,
        public shouldDisplay: boolean = true
    ) {
        super(ErrorMessages[code] || ErrorMessages[ErrorCode.UNKNOWN_ERROR]);
        this.name = 'AppError';
    }

    showToast() {
        if (this.shouldDisplay) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: ErrorMessages[this.code],
                position: 'bottom',
                visibilityTime: 4000,
            });
        }

        if (this.shouldLog) {
            console.error(this.message);
        }
    }
}

export function handleError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    const appError = new AppError(ErrorCode.UNKNOWN_ERROR, true, true);

    // Show toast automatically
    appError.showToast();

    return appError;
}
