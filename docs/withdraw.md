# Bank Withdrawals

The bank withdrawal process is implemented using the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid) in two main screens:

1. [`app/(send)/amount.tsx`](../app/(send)/amount.tsx) - Amount entry and bank account details
2. [`app/(send)/fiatconfirm.tsx`](../app/(send)/fiatconfirm.tsx) - Payment authorization and execution

## Withdrawal Process

### Step 1: Create Payment Intent (Backend)

When the user enters withdrawal details, the app creates a payment intent for fiat withdrawal using the SDK's `createPaymentIntent()` method via [`app/api/prepare-payment-intent+api.ts`](../app/api/prepare-payment-intent+api.ts):

```typescript
// Backend API with API key
import { CreatePaymentIntentRequest } from '@sqds/grid';
import { SDKGridClient } from '../../grid/sdkClient';

const gridClient = SDKGridClient.getInstance(); // Uses API key
const response = await gridClient.createPaymentIntent(smartAccountAddress, withdrawalRequest);
```

#### Withdrawal Request Structure

```typescript
{
  amount: string;          // Amount in base currency units
  grid_user_id: string;    // User's Grid ID
  source: {
    smart_account_address: string; // User's smart account
    currency: 'usdc' | 'eurc';     // Source currency
    authorities: string[];          // Authorized signer addresses
  };
  destination: {
    // Bank account details for withdrawal
    currency: 'usd' | 'eur';       // Destination fiat currency
    // Additional bank details handled by the SDK
  }
}
```

### Step 2: Sign Transaction (Frontend)

When the user confirms the withdrawal, the frontend signs the transaction locally using session secrets:

```typescript
// Frontend client WITHOUT API key
import { SDKGridClient } from './grid/sdkClient';

const gridClient = SDKGridClient.getFrontendClient(); // No API key
const signedPayload = await gridClient.sign({
  sessionSecrets: sessionSecrets,
  session: user.authentication,
  transactionPayload: transactionData.data.transactionPayload
});
```

### Step 3: Send Transaction (Backend)

The signed payload is sent to the backend which processes the withdrawal using the SDK's `send()` method via [`app/api/confirm+api.ts`](../app/api/confirm+api.ts):

```typescript
// Backend API with API key
const gridClient = SDKGridClient.getInstance(); // Uses API key
const signature = await gridClient.send({
  signedTransactionPayload: signedPayload,
  address: smartAccountAddress
});
```

## Key SDK Features for Withdrawals

- **Fiat Conversion**: The SDK handles automatic conversion from USDC/EURC to USD/EUR
- **Bank Integration**: Seamless integration with banking partners for fiat withdrawals
- **Local Signing**: Frontend signs transactions using session secrets (no API key exposure)
- **Compliance**: Built-in compliance checks and KYC validation
- **Error Handling**: Comprehensive error handling for withdrawal-specific issues

## Complete Implementation Flow

```typescript
// 1. Backend: Create withdrawal payment intent
export async function POST(request: Request) {
    const { payload, smartAccountAddress } = await request.json();
    const gridClient = SDKGridClient.getInstance(); // With API key
    const response = await gridClient.createPaymentIntent(smartAccountAddress, payload);
    return Response.json(response);
}

// 2. Frontend: Sign transaction
const frontendClient = SDKGridClient.getFrontendClient(); // No API key
const signedPayload = await frontendClient.sign({
    sessionSecrets,
    session: user.authentication,
    transactionPayload: transactionData.data.transactionPayload
});

// 3. Backend: Send signed withdrawal
export async function POST(request: Request) {
    const { address, signedTransactionPayload } = await request.json();
    const gridClient = SDKGridClient.getInstance(); // With API key
    const signature = await gridClient.send({
        signedTransactionPayload,
        address
    });
    return Response.json(signature);
}
```

## Requirements

Before processing withdrawals, ensure:
- User has completed KYC verification
- Virtual bank account is created and verified
- Sufficient balance in the smart account
- Valid session secrets for transaction signing
