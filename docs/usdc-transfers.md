# USDC Transfers

The USDC transfer process is implemented using the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid) in two main screens:

1. [`app/(send)/amount.tsx`](../app/(send)/amount.tsx) - Amount entry and recipient details
2. [`app/(send)/confirm.tsx`](../app/(send)/confirm.tsx) - Payment authorization and execution

## Transfer Process

### Step 1: Create Payment Intent (Backend)

When the user enters transfer details, the app creates a payment intent using the SDK's `createPaymentIntent()` method via [`app/api/prepare-payment-intent+api.ts`](../app/api/prepare-payment-intent+api.ts):

```typescript
// Backend API with API key
import { CreatePaymentIntentRequest } from '@sqds/grid';
import { SDKGridClient } from '../../grid/sdkClient';

const gridClient = SDKGridClient.getInstance(); // Uses API key
const response = await gridClient.createPaymentIntent(smartAccountAddress, paymentRequest);
```

#### Payment Request Structure

```typescript
{
  amount: string;          // Amount in USDC base units
  grid_user_id: string;    // User's Grid ID
  source: {
    smart_account_address: string; // Sender's smart account
    currency: 'usdc';
    authorities: string[];   // Authorized signer addresses
  };
  destination: {
    address: string;       // Recipient's Solana address
    currency: 'usdc';
  }
}
```

### Step 2: Sign Transaction (Frontend)

When the user confirms the transfer, the frontend signs the transaction locally using session secrets:

```typescript
// Frontend client WITHOUT API key (secure - no key exposure)
import { SDKGridClient } from './grid/sdkClient';

const gridClient = SDKGridClient.getFrontendClient(); // No API key
const signedPayload = await gridClient.sign({
  sessionSecrets: sessionSecrets,
  session: user.authentication,
  transactionPayload: transactionData.data.transactionPayload
});
```

**Critical Security Points:**
- **Frontend uses `sign()` only** - never exposes API key to frontend
- **Session secrets enable local signing** - private keys never leave the device

### Step 3: Send Transaction (Backend)

The signed payload is sent to the backend which submits it using the SDK's `send()` method via [`app/api/confirm+api.ts`](../app/api/confirm+api.ts):

```typescript
// Backend API with API key
const gridClient = SDKGridClient.getInstance(); // Uses API key
const signature = await gridClient.send({
  signedTransactionPayload: signedPayload,
  address: smartAccountAddress
});
```

## Security Architecture 

The Grid SDK uses a secure three-step process that separates signing from sending:

- **Frontend Signing**: Uses `getFrontendClient()` with `sign()` - no API key required or exposed
- **Backend Operations**: Uses `getInstance()` with API key for `createPaymentIntent()` and `send()`
- **Session Secrets**: Enable secure local signing without exposing private keys
- **Type Safety**: Uses TypeScript interfaces from `@sqds/grid` for all requests
- **Error Handling**: Built-in error handling for session expiration and other common scenarios

## Complete Implementation Flow

```typescript
// 1. Backend: Create payment intent
export async function POST(request: Request) {
    const { payload, smartAccountAddress } = await request.json();
    const gridClient = SDKGridClient.getInstance(); // With API key
    const response = await gridClient.createPaymentIntent(smartAccountAddress, payload);
    return Response.json(response);
}

// 2. Frontend: Sign transaction (secure - no API key exposure)
const frontendClient = SDKGridClient.getFrontendClient(); // No API key
const signedPayload = await frontendClient.sign({
    sessionSecrets,
    session: user.authentication,
    transactionPayload: transactionData.data.transactionPayload
});

// 3. Backend: Send signed transaction
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

