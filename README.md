# Tipjar

A decentralized tipping platform built on the Stacks blockchain. Send micro-tips to your favorite creators using STX, earn loyalty tokens, and participate in community governance.

## Features

- Send STX tips to any registered creator
- Earn TIP loyalty tokens for tipping activity
- Creator registration and profile management
- Tipping streak rewards with multipliers
- Community governance for platform parameters
- Real-time on-chain event monitoring via Chainhooks
- Multi-wallet support (Hiro Wallet + WalletConnect)

## Tech Stack

- **Smart Contracts**: Clarity 4 (epoch 3.3) on Stacks
- **Frontend**: React 18 with Vite
- **Blockchain SDK**: @stacks/connect, @stacks/transactions
- **Wallet**: WalletConnect v2 Sign Client
- **Monitoring**: @hirosystems/chainhooks-client
- **Testing**: Vitest

## Installation

```bash
git clone https://github.com/teefeh-07/tipjar.git
cd tipjar
npm install
```

## Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `WALLETCONNECT_PROJECT_ID` - Get from cloud.walletconnect.com
- `CHAINHOOKS_API_KEY` - Get from Hiro Platform
- `STACKS_NETWORK` - mainnet, testnet, or devnet

## Usage

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy contracts
npm run deploy
```

## Smart Contracts

| Contract | Description |
|----------|-------------|
| tipjar.clar | Core tipping logic |
| tip-token.clar | SIP-010 loyalty token |
| tip-registry.clar | Creator directory |
| tip-rewards.clar | Streak and bonus system |
| tip-governance.clar | Community voting |

