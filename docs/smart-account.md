# Smart Account

The smart account is the core account that handles funds and is required for all operations except authentication. **Smart accounts are created automatically during the authentication process** - no manual creation is needed.

## Automatic Creation During Authentication

### For New Users (Registration)

Smart accounts are automatically created when new users complete registration using `completeAuthAndCreateAccount()`:

```typescript
// This happens automatically during registration
const response = await gridClient.completeAuthAndCreateAccount({
  otpCode: code,
  sessionSecrets: sessionSecrets,
  user: userData
});

// Response includes the newly created smart account
{
  smart_account_address: string;  // Solana address of the smart account
  grid_user_id: string;          // Unique Grid user identifier
  // ... additional user data
}
```

### For Existing Users (Login)

Smart accounts are automatically retrieved when existing users login using `completeAuth()`:

```typescript
// This happens automatically during login
const response = await gridClient.completeAuth({
  otpCode: code,
  sessionSecrets: sessionSecrets,
  user: userData
});

// Response includes the existing smart account details
```

## Usage

The smart account address is used in all subsequent SDK operations and holds the user's funds. It can be used to:

- Receive USDC transfers (as demonstrated in the [QR Code component](../components/ui/organisms/WalletQRCode.tsx))
- Execute payment intents and transfers
- Create virtual bank accounts for fiat operations
- Store account balances across different currencies

## Key Points

- **No Manual Creation Required**: Smart accounts are created automatically during user registration
- **Always Available After Auth**: Once authenticated, the smart account address is available for all operations  
- **Persistent**: Smart accounts persist across login sessions for existing users
- **Integrated with SDK**: All SDK operations that require a smart account will use the one from authentication

See the [Authentication Flow documentation](authentication.md) for details on how smart accounts are created during the registration and login process.

