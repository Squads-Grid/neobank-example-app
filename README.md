# Neobank Example App (Grid API Demo)

![neobank-example-app](https://github.com/user-attachments/assets/f5c6e770-36e6-43dc-953e-dd16369d2ab6)


This is a demo React Native app built with [Expo](https://expo.dev/), designed to showcase the [Grid API]. It demonstrates authentication, KYC, virtual account creation, and more, using a modern Expo Router structure.

> ⚠️ **Disclaimer:** This is a demo application intended for educational and demonstration purposes only. 

## Table of Contents

- [Overview](#overview)
- [API Architecture](#api-architecture)
- [Grid Features](#grid-features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [App Flow](#app-flow)
- [Troubleshooting](#troubleshooting)
- [Customization](#customization)
- [Resources](#resources)

## Overview

This demo app showcases how to integrate Grid API's open banking features into a React Native application. It includes:

- Email authentication with OTP verification
- KYC onboarding flow
- Virtual bank account creation
- Fiat deposits and withdrawals
- USDC transfers
- Payment history tracking

## API Architecture

The app communicates with the Grid API through a backend API layer. This architecture ensures that sensitive API keys and secrets are never exposed to the frontend:

- The app uses [easClient.ts](utils/easClient.ts) to make requests to our backend API routes (located in the `api` folder)
- The backend API uses EAS secrets to securely interact with the Grid API using [gridClient.ts](grid/gridClient.ts)
- This way, all sensitive credentials stay on the backend while the app only needs to know the public API endpoint

## Grid Features

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
git clone https://github.com/your-org/neobank-example-app.git
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
For the best experience, install the [Expo Go app](https://expo.dev/client) on your iOS or Android device to preview the app instantly.

---

### 3. **Install dependencies**

```sh
npm install
# or
yarn install
```

### 4. **Set up environment variables**

This app uses environment variables for API keys and endpoints.  
**Do not commit your `.env` file!**

1. Copy the example file:

```sh
cp example.env .env
```

2. Open `.env` and update the variables with your own values.

If you use EAS (Expo Application Services), set these as [EAS secrets](https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables).

### 5. **Run the app locally**

```sh
npx expo start
```

- Scan the QR code with your Expo Go app, or run on an emulator/simulator.

## Project Structure

```
grid/                    # Core Grid API integration
  gridClient.ts         # Grid API client
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

- **Grid Integration:** See [`grid/gridClient.ts`](grid/gridClient.ts) and [`grid/authorization.ts`](grid/authorization.ts)
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
  If `localhost` does not work for your API, update `GRID_ENDPOINT` in your `.env` to your machine's local IP address or a reachable API endpoint.
- **Expo Go/QR code issues?**  
  If you can't open the app in Expo Go or scan the QR code, you can open the development server directly by visiting a link like `exp://192.168.x.x:8081` (replace with your machine's IP and port) on your phone. Make sure your development server is running and your phone is on the same network.
- **UI issues?**  
  Run `npx expo start -c` to clear cache.

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Go App](https://expo.dev/client)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)


