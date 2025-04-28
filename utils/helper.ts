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

/**
 * Format a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

/**
 * Truncate a string to a specified length and add ellipsis
 * @param str - The string to truncate
 * @param length - The maximum length
 * @returns Truncated string
 */
export const truncateString = (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
};

/**
 * Generate a random ID
 * @param length - The length of the ID
 * @returns Random ID string
 */
export const generateId = (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
