# Quick Setup Guide

This guide will help you get the Grid SDK demo app running in minutes.

## Prerequisites

- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli`)
- Grid API key 

## 1. Clone & Install

```bash
git clone <repository-url>
cd neobank-example-app
npm install
```

## 2. Environment Setup

Copy the example environment file:

```bash
cp example.env .env
```

Update `.env` with your Grid credentials:

```env
# Required: Your Grid API key (backend only)
GRID_API_KEY=your_actual_api_key_here

# Required: Grid environment
EXPO_PUBLIC_GRID_ENV=sandbox

# Required: Your local API endpoint
EXPO_PUBLIC_API_ENDPOINT=http://localhost:8081/api
```

## 3. Run the App

```bash
npx expo start
```

## SDK Integration Reference

This app demonstrates key Grid SDK patterns:

- **Authentication**: Email + OTP flow
- **Smart Accounts**: Account creation and management  
- **KYC**: Identity verification integration
- **Virtual Accounts**: Bank account creation
- **Payments**: USDC transfers and fiat operations

Check the `app/api/` folder for backend SDK usage examples and `grid/sdkClient.ts` for the SDK configuration.

## Support

- Check the main [README.md](README.md) for detailed documentation
- Review the `/docs` folder for specific feature guides
- Contact Grid team for SDK support
