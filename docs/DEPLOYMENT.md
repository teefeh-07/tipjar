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

## Frontend Deployment

```bash
npm run build
# Deploy the /dist folder to your hosting provider
```

Recommended hosts: Vercel, Netlify, or Cloudflare Pages.

## Post-Deployment Checklist

- [ ] Verify contracts on Stacks Explorer
- [ ] Test send-tip on deployed contract
- [ ] Confirm Chainhooks webhooks are receiving events
- [ ] Verify WalletConnect sessions work in production
- [ ] Check all environment variables are set
- [ ] Monitor first few transactions for errors
