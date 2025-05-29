# Neobank Example App (Grid API Demo)

This is a demo React Native app built with [Expo](https://expo.dev/), designed to showcase the [Grid API]. It demonstrates authentication, KYC, virtual account creation, and more, using a modern Expo Router structure.

## Table of Contents

- [Grid Features](#grid-features)
- [Getting Started](#getting-started)
- [Troubleshooting](#troubleshooting)
- [App Flow](#app-flow)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Resources](#resources)

## Grid Features

- Email authentication and OTP flow
- KYC (Know Your Customer) onboarding
- Virtual bank account creation
- On/Off-ramp: Send fiat and receive USDC (on-ramp), or convert USDC to fiat and withdraw to your bank account (off-ramp)
- USDC transfers
- Displaying / fetching payment history
---

## Getting Started

### 1. **Clone the repository**

```sh
git clone https://github.com/your-org/neobank-example-app.git
cd neobank-example-app
```

### 1. **Install Expo CLI**

If you haven't already, install the Expo CLI globally:

```sh
npm install -g expo-cli
```

You can also use `npx` for most commands if you don't want to install globally.

---

**Optional:**  
For the best experience, install the [Expo Go app](https://expo.dev/client) on your iOS or Android device to preview the app instantly.

---

### 2. **Install dependencies**

```sh
npm install
# or
yarn install
```

### 3. **Set up environment variables**

This app uses environment variables for API keys and endpoints.  
**Do not commit your `.env` file!**

1. Copy the example file:

```sh
cp example.env .env
```

2. Open `.env` and update the variables with your own values:


If you use EAS (Expo Application Services), set these as [EAS secrets](https://docs.expo.dev/build-reference/variables/#using-secrets-in-environment-variables).

---

### 4. **Run the app locally**

```sh
npx expo start
```

- Scan the QR code with your Expo Go app, or run on an emulator/simulator.

---

## Troubleshooting

- **Environment variables not working?**  
  Make sure you restart Expo after editing `.env` or EAS secrets.
- **API errors or localhost not working?**  
  If `localhost` does not work for your API, update `GRID_ENDPOINT` in your `.env` to your machine's local IP address or a reachable API endpoint.
- **Expo Go/QR code issues?**  
  If you can't open the app in Expo Go or scan the QR code, you can open the development server directly by visiting a link like `exp://192.168.x.x:8081` (replace with your machine's IP and port) on your phone. Make sure your development server is running and your phone is on the same network.
- **UI issues?**  
  Run `npx expo start -c` to clear cache.

---

## App Flow

- **Authentication:** Enter your email, receive an OTP, and log in.
- **KYC:** Complete the KYC flow and accept the Terms of Service, in order to create a virtual bank account and send money to and from your 
- **Virtual Account:** After KYC, create a virtual bank account.
- **Send/Receive:** Try sending and receiving funds using the demo flows.

---

## Project Structure

```
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
app/
  (auth)/
  (modals)/
  (tabs)/
  ...
```

- **API logic:** See [`utils/gridClient.ts`](utils/gridClient.ts)
- **KYC logic:** See [`hooks/useKyc.ts`](hooks/useKyc.ts)
- **Modals:** See [`components/ui/organisms/modals/`](components/ui/organisms/modals/)

---

## Customization

- **Grid API:** All API calls are centralized in `utils/gridClient.ts`.  
- **UI:** Built with atomic design for easy extension and theming.
- **Navigation:** Uses [Expo Router](https://docs.expo.dev/router/introduction/).

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Go App](https://expo.dev/client)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)


