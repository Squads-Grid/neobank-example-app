# Bank Deposits

The bank deposit process is implemented in [`app/(modals)/bankdetails.tsx`](../app/(modals)/bankdetails.tsx) - Virtual bank account details and creation

### Step 1: Virtual Account Creation

When the user creates a new virtual bank account, the app:

1. Calls the virtual account creation endpoint:
   ```
   POST /v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/virtual-accounts
   ```
   with payload:
   ```typescript
   {
     currency: 'usd' | 'eur';  // Currency for the virtual account
     grid_user_id: string;     // User's Grid ID
   }
   ```

2. Fetches the bank account details using:
   ```
   GET /v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/virtual-accounts
   ```
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

### Deposit Process

Once the virtual account is set up:

1. Users receive bank account details for deposits
2. Deposits are automatically converted to USDC/EURC
3. Minimum transfer amount: $1 USD or €1 EUR
