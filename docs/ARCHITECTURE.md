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

## Data Flow

1. User interacts with a Component (e.g., SendTip)
2. Component calls a Hook (e.g., useTransaction)
3. Hook delegates to a Service (e.g., stacksService)
4. Service builds and broadcasts a Stacks transaction
5. Smart contract processes the transaction on-chain
6. Chainhooks detects transaction and triggers webhook
7. Notification service updates the UI in real-time

## Smart Contract Interactions

- **tipjar.clar**: Called by stacksService for sending and querying tips
- **tip-token.clar**: Minted by the rewards system when tips are sent
- **tip-registry.clar**: Manages creator profiles, queried for discoverability
- **tip-rewards.clar**: Tracks tipping streaks and calculates multipliers
- **tip-governance.clar**: Manages proposals and voting

