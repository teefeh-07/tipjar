# Deployment Guide

## Prerequisites

- Clarinet CLI installed
- Node.js 18+
- A funded Stacks wallet for deployment
- API keys for Chainhooks (optional)

## Contract Deployment

### Devnet
```bash
clarinet check
clarinet console
```

### Testnet
```bash
clarinet deployments generate --testnet
clarinet deployments apply --testnet
```

### Mainnet
```bash
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```

