// Part 7: Documentation branches
module.exports = [
    {
        name: 'docs/readme',
        prTitle: 'docs: create comprehensive project README',
        prBody: 'Adds the main README.md with project overview, feature list, tech stack breakdown, installation instructions, usage guide, testing instructions, and contribution guidelines. Serves as the primary entry point for new developers discovering the project.',
        commits: [
            { file: 'README.md', mode: 'create', content: '# Tipjar\n\n', msg: 'docs: create README with project title' },
            { file: 'README.md', mode: 'append', content: 'A decentralized tipping platform built on the Stacks blockchain. Send micro-tips to your favorite creators using STX, earn loyalty tokens, and participate in community governance.\n\n', msg: 'docs: add project description to README' },
            { file: 'README.md', mode: 'append', content: '## Features\n\n- Send STX tips to any registered creator\n- Earn TIP loyalty tokens for tipping activity\n- Creator registration and profile management\n- Tipping streak rewards with multipliers\n- Community governance for platform parameters\n- Real-time on-chain event monitoring via Chainhooks\n- Multi-wallet support (Hiro Wallet + WalletConnect)\n\n', msg: 'docs: add features section to README' },
            { file: 'README.md', mode: 'append', content: '## Tech Stack\n\n- **Smart Contracts**: Clarity 4 (epoch 3.3) on Stacks\n- **Frontend**: React 18 with Vite\n- **Blockchain SDK**: @stacks/connect, @stacks/transactions\n- **Wallet**: WalletConnect v2 Sign Client\n- **Monitoring**: @hirosystems/chainhooks-client\n- **Testing**: Vitest\n\n', msg: 'docs: add tech stack section to README' },
            { file: 'README.md', mode: 'append', content: '## Installation\n\n```bash\ngit clone https://github.com/teefeh-07/tipjar.git\ncd tipjar\nnpm install\n```\n\n', msg: 'docs: add installation instructions' },
            { file: 'README.md', mode: 'append', content: '## Configuration\n\nCopy `.env.example` to `.env` and fill in your values:\n\n```bash\ncp .env.example .env\n```\n\nRequired variables:\n- `WALLETCONNECT_PROJECT_ID` - Get from cloud.walletconnect.com\n- `CHAINHOOKS_API_KEY` - Get from Hiro Platform\n- `STACKS_NETWORK` - mainnet, testnet, or devnet\n\n', msg: 'docs: add configuration guide to README' },
            { file: 'README.md', mode: 'append', content: '## Usage\n\n```bash\n# Start development server\nnpm run dev\n\n# Run tests\nnpm test\n\n# Build for production\nnpm run build\n\n# Deploy contracts\nnpm run deploy\n```\n\n', msg: 'docs: add usage commands to README' },
            { file: 'README.md', mode: 'append', content: '## Smart Contracts\n\n| Contract | Description |\n|----------|-------------|\n| tipjar.clar | Core tipping logic |\n| tip-token.clar | SIP-010 loyalty token |\n| tip-registry.clar | Creator directory |\n| tip-rewards.clar | Streak and bonus system |\n| tip-governance.clar | Community voting |\n\n', msg: 'docs: add smart contracts overview table' },
            { file: 'README.md', mode: 'append', content: '## Contributing\n\nContributions are welcome! Please read CONTRIBUTING.md for guidelines.\n\n## License\n\nMIT License - see LICENSE for details.\n', msg: 'docs: add contributing and license sections' },
        ]
    },
    {
        name: 'docs/architecture',
        prTitle: 'docs: create architecture documentation',
        prBody: 'Adds ARCHITECTURE.md documenting the project structure, module dependencies, data flow between components, and the smart contract interaction model. Essential reference for contributors who need to understand how the pieces fit together.',
        commits: [
            { file: 'docs/ARCHITECTURE.md', mode: 'create', content: '# Architecture\n\n', msg: 'docs: create architecture document' },
            { file: 'docs/ARCHITECTURE.md', mode: 'append', content: '## Overview\n\nTipjar follows a layered architecture pattern:\n\n1. **Smart Contracts** (Clarity 4) - On-chain logic and state\n2. **Services** - Business logic and blockchain interaction\n3. **Hooks** - React state management and side effects\n4. **Components** - UI rendering and user interaction\n\n', msg: 'docs: add architectural overview and layers' },
            { file: 'docs/ARCHITECTURE.md', mode: 'append', content: '## Project Structure\n\n```\ntipjar/\n├── contracts/          # Clarity smart contracts\n├── src/\n│   ├── components/     # React UI components\n│   ├── services/       # Blockchain and business logic\n│   ├── hooks/          # Custom React hooks\n│   ├── utils/          # Helper functions\n│   ├── config/         # Configuration modules\n│   └── types/          # TypeScript definitions\n├── tests/              # Test suites\n├── docs/               # Documentation\n├── scripts/            # Deployment and utility scripts\n└── settings/           # Clarinet network settings\n```\n\n', msg: 'docs: add project directory structure diagram' },
            { file: 'docs/ARCHITECTURE.md', mode: 'append', content: '## Data Flow\n\n1. User interacts with a Component (e.g., SendTip)\n2. Component calls a Hook (e.g., useTransaction)\n3. Hook delegates to a Service (e.g., stacksService)\n4. Service builds and broadcasts a Stacks transaction\n5. Smart contract processes the transaction on-chain\n6. Chainhooks detects transaction and triggers webhook\n7. Notification service updates the UI in real-time\n\n', msg: 'docs: document data flow between layers' },
            { file: 'docs/ARCHITECTURE.md', mode: 'append', content: '## Smart Contract Interactions\n\n- **tipjar.clar**: Called by stacksService for sending and querying tips\n- **tip-token.clar**: Minted by the rewards system when tips are sent\n- **tip-registry.clar**: Manages creator profiles, queried for discoverability\n- **tip-rewards.clar**: Tracks tipping streaks and calculates multipliers\n- **tip-governance.clar**: Manages proposals and voting\n\n', msg: 'docs: document smart contract interaction patterns' },
            { file: 'docs/ARCHITECTURE.md', mode: 'append', content: '## Wallet Integration\n\nThe platform supports two wallet providers:\n\n1. **Hiro Wallet** - Via @stacks/connect, uses `showConnect` and `openSTXTransfer`\n2. **WalletConnect** - Via @walletconnect/sign-client, supports any WC-compliant wallet\n\nThe `useWallet` hook abstracts the provider difference from components.\n', msg: 'docs: explain dual wallet integration architecture' },
        ]
    },
    {
        name: 'docs/api-reference',
        prTitle: 'docs: create API reference documentation',
        prBody: 'Adds API.md with detailed documentation for every exported function, hook, and service method. Includes parameter types, return types, usage examples, and error scenarios. Organized by module for easy navigation.',
        commits: [
            { file: 'docs/API.md', mode: 'create', content: '# API Reference\n\n', msg: 'docs: create API reference document' },
            { file: 'docs/API.md', mode: 'append', content: '## Services\n\n### stacksService\n\n#### `sendTip(recipientAddress, amountInMicroStx)`\nSends an STX tip to the specified recipient.\n- **recipientAddress** `string` - Stacks address of the recipient\n- **amountInMicroStx** `string` - Amount in micro-STX\n- **Returns** `Promise<TransactionResult>`\n\n', msg: 'docs: add stacksService sendTip API docs' },
            { file: 'docs/API.md', mode: 'append', content: '#### `registerCreator(name, description, category)`\nRegisters the current user as a creator in the tip registry.\n- **name** `string` - Display name (max 64 chars)\n- **description** `string` - Creator description (max 256 chars)\n- **category** `string` - Creator category (max 32 chars)\n- **Returns** `Promise<TransactionResult>`\n\n#### `getTipAmount(sender, recipient)`\nQueries the on-chain tip amount between two addresses.\n- **Returns** `Promise<ClarityValue>`\n\n', msg: 'docs: add registerCreator and getTipAmount API docs' },
            { file: 'docs/API.md', mode: 'append', content: '### walletConnectService\n\n#### `initWalletConnect()`\nInitializes the WalletConnect SignClient and Modal.\n- **Returns** `Promise<SignClient>`\n\n#### `connectWallet()`\nOpens the WalletConnect modal and returns the session.\n- **Returns** `Promise<Session>`\n\n#### `disconnectWallet()`\nDisconnects the current WalletConnect session.\n\n', msg: 'docs: add walletConnectService API reference' },
            { file: 'docs/API.md', mode: 'append', content: '### chainhooksService\n\n#### `initChainhooks()`\nInitializes the Chainhooks client with API credentials.\n\n#### `registerTipWebhook(contractAddress, contractName)`\nRegisters a webhook for tip contract call events.\n\n#### `handleWebhookPayload(payload)`\nProcesses incoming webhook payloads from Chainhooks.\n\n', msg: 'docs: add chainhooksService API reference' },
            { file: 'docs/API.md', mode: 'append', content: '## Hooks\n\n### `useWallet()`\nReturns `{ connected, address, provider, connect, disconnect }`\n\n### `useTransaction()`\nReturns `{ txId, status, error, submit, checkStatus, reset }`\n\n### `useTipHistory(refreshInterval?)`\nReturns `{ history, loading, count }`\n\n', msg: 'docs: add hooks API reference' },
            { file: 'docs/API.md', mode: 'append', content: '## Utilities\n\n### helpers\n- `microToStx(microStx)` - Convert micro-STX to STX\n- `stxToMicro(stx)` - Convert STX to micro-STX\n- `truncateAddress(address)` - Truncate address for display\n- `formatStx(microStx)` - Format micro-STX as display string\n- `debounce(fn, delayMs)` - Debounce function calls\n\n### validation\n- `validateStxAddress(address)` - Validate a Stacks address\n- `validateTipAmount(amountMicro)` - Validate tip amount bounds\n- `validateMemo(memo)` - Validate memo length\n- `sanitizeInput(input)` - Strip dangerous characters\n', msg: 'docs: add utilities API reference' },
        ]
    },
    {
        name: 'docs/deployment-guide',
        prTitle: 'docs: create deployment guide for contracts and frontend',
        prBody: 'Adds DEPLOYMENT.md with step-by-step instructions for deploying Clarity contracts via Clarinet to devnet, testnet, and mainnet, as well as building and deploying the React frontend. Includes common pitfalls, gas estimation tips, and post-deployment verification steps.',
        commits: [
            { file: 'docs/DEPLOYMENT.md', mode: 'create', content: '# Deployment Guide\n\n', msg: 'docs: create deployment guide document' },
            { file: 'docs/DEPLOYMENT.md', mode: 'append', content: '## Prerequisites\n\n- Clarinet CLI installed\n- Node.js 18+\n- A funded Stacks wallet for deployment\n- API keys for Chainhooks (optional)\n\n', msg: 'docs: add deployment prerequisites' },
            { file: 'docs/DEPLOYMENT.md', mode: 'append', content: '## Contract Deployment\n\n### Devnet\n```bash\nclarinet check\nclarinet console\n```\n\n### Testnet\n```bash\nclarinet deployments generate --testnet\nclarinet deployments apply --testnet\n```\n\n### Mainnet\n```bash\nclarinet deployments generate --mainnet\nclarinet deployments apply --mainnet\n```\n\n', msg: 'docs: add contract deployment commands for all networks' },
            { file: 'docs/DEPLOYMENT.md', mode: 'append', content: '## Frontend Deployment\n\n```bash\nnpm run build\n# Deploy the /dist folder to your hosting provider\n```\n\nRecommended hosts: Vercel, Netlify, or Cloudflare Pages.\n\n', msg: 'docs: add frontend build and deploy instructions' },
            { file: 'docs/DEPLOYMENT.md', mode: 'append', content: '## Post-Deployment Checklist\n\n- [ ] Verify contracts on Stacks Explorer\n- [ ] Test send-tip on deployed contract\n- [ ] Confirm Chainhooks webhooks are receiving events\n- [ ] Verify WalletConnect sessions work in production\n- [ ] Check all environment variables are set\n- [ ] Monitor first few transactions for errors\n', msg: 'docs: add post-deployment verification checklist' },
        ]
    },
    {
        name: 'docs/contributing',
        prTitle: 'docs: add CONTRIBUTING.md with development guidelines',
        prBody: 'Creates the contributing guide covering the development setup, branch naming convention, commit message format (conventional commits), PR process, code review expectations, and testing requirements. Ensures a consistent workflow for all contributors.',
        commits: [
            { file: 'docs/CONTRIBUTING.md', mode: 'create', content: '# Contributing to Tipjar\n\nThank you for your interest in contributing to Tipjar!\n\n', msg: 'docs: create contributing guide with welcome' },
            { file: 'docs/CONTRIBUTING.md', mode: 'append', content: '## Development Setup\n\n1. Fork the repository\n2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/tipjar.git`\n3. Install dependencies: `npm install`\n4. Create a feature branch: `git checkout -b feature/your-feature`\n5. Make your changes with micro-commits\n6. Push and create a PR\n\n', msg: 'docs: add development setup instructions' },
            { file: 'docs/CONTRIBUTING.md', mode: 'append', content: '## Commit Convention\n\nWe use conventional commits:\n- `feat:` - New feature\n- `fix:` - Bug fix\n- `docs:` - Documentation\n- `test:` - Adding tests\n- `refactor:` - Code restructuring\n- `style:` - Formatting changes\n- `chore:` - Build/tooling changes\n\nExample: `feat: add tip amount validation to SendTip form`\n\n', msg: 'docs: document commit message convention' },
            { file: 'docs/CONTRIBUTING.md', mode: 'append', content: '## Branch Naming\n\n- `feature/description` - New features\n- `fix/description` - Bug fixes\n- `docs/description` - Documentation\n- `test/description` - Test additions\n- `setup/description` - Configuration\n\n', msg: 'docs: add branch naming conventions' },
            { file: 'docs/CONTRIBUTING.md', mode: 'append', content: '## Pull Requests\n\n- Keep PRs focused and small\n- Include a clear description of changes\n- Reference any related issues\n- Ensure all tests pass\n- Request review from at least one maintainer\n\n', msg: 'docs: add pull request guidelines' },
            { file: 'docs/CONTRIBUTING.md', mode: 'append', content: '## Code Style\n\n- Use ES modules (import/export)\n- Follow existing naming conventions\n- Add JSDoc comments for public functions\n- Keep functions small and focused\n- Write tests for new functionality\n', msg: 'docs: add code style guidelines' },
        ]
    },
    {
        name: 'docs/changelog',
        prTitle: 'docs: create CHANGELOG for version tracking',
        prBody: 'Initializes the CHANGELOG.md following Keep a Changelog format. Documents the 1.0.0 release with all features implemented in this initial build: smart contracts, wallet integration, chainhooks monitoring, tip management, and governance.',
        commits: [
            { file: 'docs/CHANGELOG.md', mode: 'create', content: '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n', msg: 'docs: create changelog with header' },
            { file: 'docs/CHANGELOG.md', mode: 'append', content: '## [1.0.0] - 2026-02-25\n\n### Added\n- Core tipjar smart contract for STX tipping\n- SIP-010 compliant TIP loyalty token\n- On-chain creator registry\n', msg: 'docs: add 1.0.0 smart contract changelog entries' },
            { file: 'docs/CHANGELOG.md', mode: 'append', content: '- Tipping streak and rewards system\n- Community governance with proposals and voting\n- Stacks wallet integration via @stacks/connect\n- WalletConnect v2 multi-wallet support\n', msg: 'docs: add 1.0.0 integration changelog entries' },
            { file: 'docs/CHANGELOG.md', mode: 'append', content: '- Real-time event monitoring via @hirosystems/chainhooks-client\n- Dashboard with platform statistics\n- Tip history and leaderboard components\n- Input validation and sanitization utilities\n- Comprehensive test suite\n', msg: 'docs: add 1.0.0 feature and testing changelog entries' },
        ]
    },
    {
        name: 'docs/security',
        prTitle: 'docs: add SECURITY.md with vulnerability disclosure policy',
        prBody: 'Creates a SECURITY.md document outlining the responsible disclosure process, supported versions, security best practices followed by the project, and contact information for reporting vulnerabilities. Important for any project handling financial transactions.',
        commits: [
            { file: 'docs/SECURITY.md', mode: 'create', content: '# Security Policy\n\n', msg: 'docs: create security policy document' },
            { file: 'docs/SECURITY.md', mode: 'append', content: '## Supported Versions\n\n| Version | Supported |\n|---------|-----------|\n| 1.0.x   | Yes       |\n\n', msg: 'docs: add supported versions table' },
            { file: 'docs/SECURITY.md', mode: 'append', content: '## Reporting a Vulnerability\n\nIf you discover a security vulnerability, please report it responsibly:\n\n1. **Do NOT** open a public issue\n2. Email security concerns to the maintainers\n3. Include steps to reproduce the vulnerability\n4. Allow 48 hours for an initial response\n\n', msg: 'docs: add vulnerability reporting process' },
            { file: 'docs/SECURITY.md', mode: 'append', content: '## Security Practices\n\n- Smart contracts audited with Clarinet check_checker\n- No private keys stored in source code\n- Environment variables for all secrets\n- Input sanitization on all user inputs\n- Post-conditions enforced on contract calls\n- WalletConnect sessions properly scoped\n', msg: 'docs: document security best practices' },
        ]
    },
];
