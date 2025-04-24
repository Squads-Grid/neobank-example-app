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
