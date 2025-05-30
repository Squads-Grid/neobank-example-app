# Bank Withdrawals

The bank withdrawal process is implemented in two main screens:

1. [`app/(send)/amount.tsx`](../app/(send)/amount.tsx) - Amount entry and bank account details
2. [`app/(send)/fiatconfirm.tsx`](../app/(send)/fiatconfirm.tsx) - Payment authorization and execution

### Step 1: Payment Intent Preparation

When the user hits the confirm button, the app will request the payment intent, authorize it and submit it. This step:

1. Calls the payment intent endpoint

2. Authorizes the payment 

3. Submits the payment intent for processing using the `v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/payment-intents?use-mpc-provider=true`

When the user confirms, the app:

1. Prepares the payment intent using the `v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/payment-intents?use-mpc-provider=true`:

2. Authorize the payment using [`grid/authorization.ts`](../grid/authorization.ts):
   - Decrypts the credential bundle
   - Creates a stamp using `GridStamper`
   - Signs the MPC payload

3. Submits the payment intent to the `v0/grid/smart-accounts/<SMART_ACCOUNT_ADDRESS>/payment-intents?use-mpc-provider=true` endpoint.
