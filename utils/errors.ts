import Toast from 'react-native-toast-message';

export enum ErrorCode {
    // Authentication errors
    AUTH_FAILED = 'AUTH_FAILED',
    INVALID_OTP = 'INVALID_OTP',
    OTP_EXPIRED = 'OTP_EXPIRED',
    OTP_RATE_LIMIT = 'OTP_RATE_LIMIT',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    INVALID_EMAIL = 'INVALID_EMAIL',

    // External account errors
    INVALID_NAME = 'INVALID_NAME',
    INVALID_ADDRESS = 'INVALID_ADDRESS',
    INVALID_BANK_ACCOUNT = 'INVALID_BANK_ACCOUNT',
    INVALID_LABEL = 'INVALID_LABEL',
    INVALID_AMOUNT = 'INVALID_AMOUNT',

    // Transaction errors
    INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',

    // Network errors
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',

}

// Error messages that can be displayed to the user
export const ErrorMessages: Record<ErrorCode, string> = {
    // Authentication errors
    [ErrorCode.AUTH_FAILED]: 'Authentication failed. Please try again.',
    [ErrorCode.INVALID_OTP]: 'Invalid OTP. Please try again.',
    [ErrorCode.OTP_EXPIRED]: 'OTP expired. Please request a new one.',
    [ErrorCode.OTP_RATE_LIMIT]: 'Too many attempts. Please try again later.',
    [ErrorCode.SESSION_EXPIRED]: 'Session expired. Please log in again.',
    [ErrorCode.INVALID_EMAIL]: 'Invalid email. Please try again.',

    // External account errors
    [ErrorCode.INVALID_ADDRESS]: 'Invalid address. Please try again.',
    [ErrorCode.INVALID_BANK_ACCOUNT]: 'Invalid bank account details. Please check your account number and routing number.',
    [ErrorCode.INVALID_NAME]: 'Invalid name. Please try again.',
    [ErrorCode.INVALID_LABEL]: 'Invalid label. Please try again.',
    [ErrorCode.INVALID_AMOUNT]: 'Minimum amount is $1.',

    // Transaction errors
    [ErrorCode.INSUFFICIENT_BALANCE]: 'Insufficient balance.',

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
                text1: ErrorMessages[this.code],
                position: 'top',
                visibilityTime: 4000,
            });
        }

        if (this.shouldLog) {
            console.error(`AppError: ${this.code} - ${this.message}`);
        }
    }
}

export function handleError(error: ErrorCode, shouldLog: boolean, shouldDisplay: boolean): AppError {

    const appError = new AppError(error, shouldLog, shouldDisplay);

    // Show toast automatically
    appError.showToast();

    return appError;
}
