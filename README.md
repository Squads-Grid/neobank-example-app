# Neobank Example App (@sqds/grid SDK Demo)

![neobank-example-app](https://github.com/user-attachments/assets/f5c6e770-36e6-43dc-953e-dd16369d2ab6)


This is a demo React Native app built with [Expo](https://expo.dev/), designed to showcase the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid). It demonstrates authentication, KYC, virtual account creation, and more, using a modern Expo Router structure and the official Grid SDK.

> ⚠️ **Disclaimer:** This is a demo application intended for educational and demonstration purposes only. 

## Table of Contents

- [Overview](#overview)
- [SDK Architecture](#sdk-architecture)
- [Grid SDK Features](#grid-sdk-features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [App Flow](#app-flow)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## Overview

This demo app showcases how to integrate Grid into a React Native application using the official [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid). It includes:

- Email authentication with OTP verification
- KYC onboarding flow
- Virtual bank account creation
- Fiat deposits and withdrawals
- USDC transfers
- Payment history tracking

## SDK Architecture

The app demonstrates a secure architecture using the [@sqds/grid SDK](https://www.npmjs.com/package/@sqds/grid):

- **Frontend**: Uses [easClient.ts](utils/easClient.ts) to make requests to backend API routes
- **Backend API Routes**: Located in the `app/api/` folder, these routes use the Grid SDK via [sdkClient.ts](grid/sdkClient.ts)
- **Security**: API keys are securely stored as environment variables and never exposed to the frontend
- **SDK Benefits**: Type-safe methods, built-in error handling, and simplified integration compared to raw API calls

### SDK Client Setup

The [sdkClient.ts](grid/sdkClient.ts) file provides a singleton pattern for the Grid SDK with proper environment configuration:

```typescript
import { GridClient, GridEnvironment } from '@sqds/grid';
import { SDKGridClient } from './grid/sdkClient';

// Direct SDK initialization (what happens inside SDKGridClient)
const gridClient = new GridClient({
    apiKey: process.env.GRID_API_KEY,           // Required for backend operations
    environment: 'sandbox' as GridEnvironment, // 'sandbox' or 'production'
    baseUrl: process.env.EXPO_PUBLIC_GRID_ENDPOINT // Grid Api endpoint
});

const sessionSecrets = await gridClient.generateSessionSecrets();
```

**Required Environment Variables:**
```env
GRID_API_KEY=your_grid_api_key_here           # Backend only - never expose to frontend
EXPO_PUBLIC_GRID_ENV=sandbox                  # 'sandbox' or 'production'
EXPO_PUBLIC_GRID_ENDPOINT=your_custom_endpoint # Optional: for custom Grid endpoints
```

## Grid SDK Features

- [Email authentication and OTP flow](docs/authentication.md)
- [Smart account creation](docs/smart-account.md)
- [KYC onboarding](docs/kyc.md)
- [Virtual bank account creation and deposits](docs/deposit.md)
- [Withdrawals](docs/withdraw.md)
- [USDC transfers](docs/usdc-transfers.md)
- [Balance and transfers](docs/balance-and-transfers.md)

## Getting Started

### 1. **Clone the repository**

```sh
git clone https://github.com/Squads-Grid/neobank-example-app.git
cd neobank-example-app
```

### 2. **Install Expo CLI**

If you haven't already, install the Expo CLI globally:

```sh
npm install -g expo-cli
```

You can also use `npx` for most commands if you don't want to install globally.

---

**Optional:**  
You can install the [Expo Go app](https://expo.dev/client) on your iOS or Android device to preview the app instantly.

---

### 3. **Install dependencies**

```sh
npm install
# or
yarn install
```

### 4. **Set up environment variables**

This app uses environment variables for the Grid SDK configuration and API endpoints.  
**Do not commit your `.env` file!**

1. Copy the example file:

```sh
cp example.env .env
```

2. Open `.env` and update the variables with your Grid SDK credentials:

```env
# Backend-only variables (never expose these to frontend)
GRID_API_KEY=your_grid_api_key_here

# Public variables (safe for frontend)
EXPO_PUBLIC_GRID_ENV=sandbox # or production
EXPO_PUBLIC_API_ENDPOINT=http://localhost:8081/api
```

**Important**: 
- `GRID_API_KEY` is used server-side only for SDK authentication
- `EXPO_PUBLIC_*` variables are safe to expose to the frontend
- Use `sandbox` environment for development and testing

If you use EAS (Expo Application Services), set these as [EAS secrets](https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables).

### 5. **Run the app locally**

```sh
npx expo start
```

- Scan the QR code with your Expo Go app, or run on an emulator/simulator.

## Project Structure

```
grid/                    # Core Grid SDK integration
  sdkClient.ts          # Grid SDK client wrapper
  authorization.ts      # Payment authorization
components/
  ui/
    atoms/
    molecules/
    organisms/
      modals/
  navigation/
  ...
hooks/
contexts/
types/
utils/
  easClient.ts         # Backend API client
app/
  (auth)/
  (modals)/
  (tabs)/
  ...
```

- **Grid SDK Integration:** See [`grid/sdkClient.ts`](grid/sdkClient.ts) and [`grid/authorization.ts`](grid/authorization.ts)
- **KYC logic:** See [`hooks/useKyc.ts`](hooks/useKyc.ts)
- **Modals:** See [`components/ui/organisms/modals/`](components/ui/organisms/modals/)

## App Flow

- **Authentication:** Enter your email, receive an OTP, and log in.
- **KYC:** Complete the KYC flow and accept the Terms of Service, in order to create a virtual bank account and send money to and from your 
- **Virtual Account:** After KYC, create a virtual bank account.
- **Send/Receive:** Try sending and receiving funds using the demo flows.

## Troubleshooting

- **Environment variables not working?**  
  Make sure you restart Expo after editing `.env` or EAS secrets.
- **API errors or localhost not working?**  
  If `localhost` does not work for your API, update `EXPO_PUBLIC_API_ENDPOINT` in your `.env` to your machine's local IP address or a reachable API endpoint.
- **SDK connection issues?**  
  Ensure `GRID_API_KEY` is set correctly and `EXPO_PUBLIC_GRID_ENV` matches your intended environment (sandbox/production).
- **Expo Go/QR code issues?**  
  If you can't open the app in Expo Go or scan the QR code, you can open the development server directly by visiting a link like `exp://192.168.x.x:8081` (replace with your machine's IP and port) on your phone. Make sure your development server is running and your phone is on the same network.
- **UI issues?**  
  Run `npx expo start -c` to clear cache.

## Resources

- [@sqds/grid SDK Documentation](https://www.npmjs.com/package/@sqds/grid)
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Go App](https://expo.dev/client)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)


