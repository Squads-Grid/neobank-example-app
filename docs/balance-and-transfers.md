# Transfers & Balance

The transfers and balance functionality is implemented in [`app/(tabs)/index.tsx`](../app/(tabs)/index.tsx) using the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid).

### Fetch Balance

The app fetches the current balance using the SDK's `getAccountBalances()` method via [`app/api/balance+api.ts`](../app/api/balance+api.ts):

```typescript
const gridClient = SDKGridClient.getInstance();
const response = await gridClient.getAccountBalances(smartAccountAddress);
```

This returns an array with all balances the account holds (USDC, EURC, etc.).

### Fetch Transfers

The app fetches the transaction history using the SDK's `getTransfers()` method via [`app/api/get-transfers+api.ts`](../app/api/get-transfers+api.ts):

```typescript
const gridClient = SDKGridClient.getInstance();
const response = await gridClient.getTransfers(smartAccountAddress);
```

This returns a list of all transactions (transfers, deposits, withdrawals) with their status and details.


