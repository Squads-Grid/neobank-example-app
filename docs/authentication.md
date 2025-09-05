# Authentication Flow

The Grid SDK authentication has two separate flows: **Registration** (new users) and **Login** (existing users). This document explains both flows using the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid).

## Registration Flow (New Users)

### Step 1: Create Account

When a new user enters their email:

1. Uses the Grid SDK's `createAccount()` method via [`app/api/register+api.ts`](../app/api/register+api.ts):
   ```typescript
   const gridClient = SDKGridClient.getInstance();
   const response = await gridClient.createAccount({ email });
   ```

2. The SDK sends an OTP to the user's email and returns session data

### Step 2: Complete Registration

When the user enters the OTP code:

1. Generate session secrets using the SDK:
   ```typescript
   const gridClient = SDKGridClient.getFrontendClient();
   const sessionSecrets = await gridClient.generateSessionSecrets();
   ```

2. Complete account creation via [`app/api/verify-otp-and-create-account+api.ts`](../app/api/verify-otp-and-create-account+api.ts):
   ```typescript
   const response = await gridClient.completeAuthAndCreateAccount({
     otpCode: code,
     sessionSecrets: sessionSecrets,
     user: userData
   });
   ```

## Login Flow (Existing Users)

### Step 1: Initialize Authentication

When an existing user enters their email:

1. Uses the Grid SDK's `initAuth()` method via [`app/api/auth+api.ts`](../app/api/auth+api.ts):
   ```typescript
   const gridClient = SDKGridClient.getInstance();
   const response = await gridClient.initAuth({ email });
   ```

2. The SDK sends an OTP to the user's email

### Step 2: Complete Authentication

When the user enters the OTP code:

1. Generate session secrets (same as registration):
   ```typescript
   const sessionSecrets = await gridClient.generateSessionSecrets();
   ```

2. Complete authentication via [`app/api/verify-otp+api.ts`](../app/api/verify-otp+api.ts):
   ```typescript
   const response = await gridClient.completeAuth({
     otpCode: code,
     sessionSecrets: sessionSecrets,
     user: userData
   });
   ```

## Session Secrets Management

### Purpose and Usage

Session secrets are critical for all authenticated operations in your app:

- **Transaction Signing**: Required to sign payment intents, transfers, and other blockchain transactions
- **Authenticated API Calls**: Used for operations like creating virtual accounts, KYC verification, etc.
- **Local Signing**: The SDK signs all payloads locally using session secrets
- **Security**: Session secrets never leave the device - only signed payloads are sent to the backend

### Session Lifecycle

- **Duration**: Sessions expire after **1 hour**
- **Storage**: Must be stored securely during the session
- **Renewal**: Users need to re-authenticate when sessions expire
- **Cleanup**: Should be encrypted and cleared on logout for security


## Security Considerations

- **Local Signing Architecture**: All transaction signing happens on-device using session secrets - private keys never leave the client
- **Session Secrets**: Generated fresh for each authentication attempt and must be stored securely for the 1-hour session duration
- **Secure Storage**: Use Expo SecureStore or equivalent secure storage for session secrets and user data
- **Session Expiration**: Handle 1-hour session expiration gracefully by prompting users to re-authenticate
- **No Backend Secrets**: The SDK never transmits session secrets to your backend - only signed payloads are sent
- **Environment Security**: API keys are server-side only, never exposed to frontend
- **Logout Cleanup**: Always clear session secrets from storage on logout

