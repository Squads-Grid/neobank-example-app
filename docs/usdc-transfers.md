# USDC Transfers

The USDC transfer process is implemented in two main screens:

1. [`app/(send)/amount.tsx`](../app/(send)/amount.tsx) - Amount entry and recipient details
2. [`app/(send)/confirm.tsx`](../app/(send)/confirm.tsx) - Payment authorization and execution

### Step 1: Payment Intent Preparation

When the user hits the confirm button, the app will request the payment intent, authorize it and submit it. This step:

1. Calls the 
2. Authorizes the payment 
3. Submits the payment intent for processing using the `v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/payment-intents?use-mpc-provider=true`

When the user confirms, the app:

1. Prepares the payment intent using the `v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/payment-intents?use-mpc-provider=true`:
   ```typescript
   {
     amount: string;          // Amount in USDC base units
     grid_user_id: string;    // User's Grid ID for reference by the grid api
     source: {
       smart_account_address: string; // This is the wallet that handles the funds
       currency: 'usdc';
       authorities: string[<Solanan Address>]; // Solana address that authorizes the payment
     };
     destination: {
       address: string;       // Recipient's Solana address
       currency: 'usdc';
     }
   }
   ```

2. Authorize the payment using [`grid/authoriazation.ts`](../grid/authorization.ts):
   - Decrypts the credential bundle
   - Creates a stamp using `GridStamper`
   - Signs the MPC payload

3. Submits the payment intent to the `v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/payment-intents?use-mpc-provider=true` endpoint with:
   ```typescript
   {
     intentPayload: string;
     mpcPayload: {
       requestParameters: object;
       stamp: {
         publicKey: string;
         signature: string;
       }
     }
   }
   ```
