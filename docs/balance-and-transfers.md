# Transfers & Balance

The transfers and balance are implemented in [`app/(tabs)/index.tsx`](../app/(tabs)/index.tsx) - Home screen showing balance and transaction history

### Fetch Balance

The app fetches the current balance using:
```
GET /v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/balances
```
This returns an array with all balances the account holds (USDC, EURC).

### Fetch Transfers

The app fetches the transaction history using:
```
GET /v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/payment-intents
```
This returns a list of all transactions (transfers, deposits, withdrawals) with their status and details. 

