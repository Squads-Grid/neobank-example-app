# Smart Account Creation

The smart account is the core account that handles the funds and is required for all operations except authentication. It's the first thing that has to be created after authentication in [`index.tsx`](../app/(tabs)/index.tsx).

## Endpoints

### Create Smart Account

Creates a new smart account and Grid user. This endpoint is idempotent - creating an account for an existing email will return the existing account details.

```http
POST /v0/grid/smart-accounts
```

#### Response

```json
{
  "smart_account_address": "...",
  "grid_user_id": "uuid"
}
```

## Usage

The smart account address is used in all subsequent API calls and holds the user's funds. It can be used to receive USDC as demonstrated in the [QR Code component](../components/ui/organisms/WalletQRCode.tsx).

