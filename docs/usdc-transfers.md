# USDC Transfers

The USDC transfer process is implemented in two main screens:

1. [`app/(send)/amount.tsx`](app/(send)/amount.tsx) - Amount entry and recipient details
2. [`app/(send)/confirm.tsx`](app/(send)/confirm.tsx) - Payment authorization and execution

### Step 1: Enter Amount

In the amount screen, users provide:
- Transfer amount in USD

The amount is converted to USDC base units (multiplied by 10^6) before submitting it, meaning 1 USDC will be converted into 1_000_000.

### Step 2: Enter Receipient Details
- Recipient's Solana address
- Optional: Name for future reference

### Step 3: Confirm Payment

The confirmation screen displays:
- Transfer amount
- Recipient address
- Recipient name

### Step 4: Submit Payment Intent

When confirmed, the system:

1. Prepares the payment intent with:
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

2. Authorize the payment using the user's credentials:
   - Decrypts the credential bundle
   - Creates a stamp using `GridStamper`
   - Signs the MPC payload

3. Submits the payment intent with:
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
