# Bank Deposits

The bank deposit process is implemented in [`app/(modals)/bankdetails.tsx`](../app/(modals)/bankdetails.tsx) using the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid).

### Step 1: Virtual Account Creation

When the user creates a new virtual bank account, the app:

1. Uses the Grid SDK's `requestVirtualAccount()` method via [`app/api/open-virtual-account+api.ts`](../app/api/open-virtual-account+api.ts):
   ```typescript
   {
     currency: 'usd' | 'eur';  // Currency for the virtual account
     grid_user_id: string;     // User's Grid ID
   }
   ```

2. Fetches the bank account details using the SDK via [`app/api/get-virtual-accounts+api.ts`](../app/api/get-virtual-accounts+api.ts)
   which returns:
   ```typescript
   {
     source_deposit_instructions: {
       bank_name: string;
       bank_account_number: string;
       bank_routing_number: string;  // For USD accounts only
       bank_beneficiary_name: string;
       bank_address: string;
       currency: 'usd' | 'eur';
     }
   }
   ```

### SDK Implementation

The backend API routes use the Grid SDK:

```typescript
import { SDKGridClient } from '../../grid/sdkClient';
import { RequestVirtualAccountRequest } from '@sqds/grid';

// Creating a virtual account
const gridClient = SDKGridClient.getInstance();
const virtualAccountRequest: RequestVirtualAccountRequest = {
    currency: 'usd',
    grid_user_id: 'user-grid-id'
};
const response = await gridClient.requestVirtualAccount(smartAccountAddress, virtualAccountRequest);

// Fetching virtual account details
const accounts = await gridClient.getVirtualAccounts(smartAccountAddress);
```

### Deposit Process

Once the virtual account is set up:

1. Users receive bank account details for deposits
2. Deposits are automatically converted to USDC/EURC
3. Minimum transfer amount: $1 USD or €1 EUR
