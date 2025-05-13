# NeoBank Example App

A modern banking application built with Expo and React Native, featuring secure authentication, transaction management, and a clean user interface.

## Project Structure

```
neobank-example-app/
├── app/                      # Main application code using Expo Router
│   ├── (auth)/              # Authentication related screens
│   ├── (send)/              # Transaction sending screens
│   ├── (tabs)/              # Main tab navigation screens
│   ├── (modals)/            # Modal screens
│   ├── api/                 # API route handlers
│   └── _layout.tsx          # Root layout configuration
├── assets/                  # Static assets (images, fonts, etc.)
├── components/              # Reusable React components
│   ├── ui/                 # UI components (atoms, molecules, organisms)
│   └── devtools/           # Development utility components
├── constants/              # Application constants and configuration
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions and services
│   ├── auth.ts            # Authentication utilities
│   ├── easClient.ts       # API client for EAS
│   └── turnkey.ts         # Turnkey integration utilities
└── scripts/               # Build and development scripts

## UI Structure

The application follows Atomic Design principles for component organization:

```
components/ui/
├── atoms/                  # Basic building blocks
│   ├── ThemedText.tsx     # Typography component
│   ├── IconSymbol.tsx     # Icon component
│   └── LoadingSpinner.tsx # Loading indicator
├── molecules/             # Combinations of atoms
│   ├── ButtonGroup.tsx    # Button combinations
│   └── InputField.tsx     # Form input components
├── organisms/             # Complex UI components
│   ├── TransactionItem.tsx # Transaction list item
│   └── BalanceCard.tsx    # Balance display card
└── layout/               # Layout components
    ├── ThemedScreen.tsx  # Screen wrapper
    └── SafeArea.tsx      # Safe area wrapper
```

### Design System

- **Typography**: Consistent text styles with predefined sizes and weights
- **Colors**: Theme-aware color system with light/dark mode support
- **Spacing**: Standardized spacing scale for consistent layouts
- **Components**: Reusable UI components following atomic design principles

### Component Guidelines

1. **Atoms**
   - Basic building blocks
   - Highly reusable
   - No business logic
   - Examples: buttons, inputs, icons

2. **Molecules**
   - Combinations of atoms
   - Simple interactions
   - Limited business logic
   - Examples: form fields, button groups

3. **Organisms**
   - Complex components
   - Business logic
   - State management
   - Examples: transaction items, balance cards

4. **Layout**
   - Screen structure
   - Navigation patterns
   - Theme providers
   - Examples: screens, modals

## Key Features

- **Authentication**: Secure authentication flow using OTP and MPC (Multi-Party Computation)
- **Transaction Management**: Send and receive funds with USDC support
- **Smart Accounts**: Integration with smart account functionality
- **Modern UI**: Clean and intuitive user interface
- **Type Safety**: Full TypeScript support

## Technology Stack

- **Framework**: Expo with React Native
- **Navigation**: Expo Router
- **State Management**: React Context
- **Authentication**: Turnkey MPC
- **Blockchain**: Solana (Devnet)
- **Styling**: React Native StyleSheet

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file with required variables
   - Required variables:
     - `EXPO_PUBLIC_API_ENDPOINT`
     - `GRID_API_ENPOINT`
     - `GRID_API_KEY`

3. Start the development server:
   ```bash
   npm start
   ```

## Development

- **Code Style**: Follow TypeScript best practices
- **Component Structure**: Use atomic design principles
- **State Management**: Use React Context for global state
- **API Integration**: Use the provided client utilities

## Security

- Secure authentication using MPC
- Environment variable protection
- Secure storage for sensitive data
- Transaction signing with Turnkey

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.


