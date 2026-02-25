# Architecture

## Overview

Tipjar follows a layered architecture pattern:

1. **Smart Contracts** (Clarity 4) - On-chain logic and state
2. **Services** - Business logic and blockchain interaction
3. **Hooks** - React state management and side effects
4. **Components** - UI rendering and user interaction

## Project Structure

```
tipjar/
├── contracts/          # Clarity smart contracts
├── src/
│   ├── components/     # React UI components
│   ├── services/       # Blockchain and business logic
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration modules
│   └── types/          # TypeScript definitions
├── tests/              # Test suites
├── docs/               # Documentation
├── scripts/            # Deployment and utility scripts
└── settings/           # Clarinet network settings
```

