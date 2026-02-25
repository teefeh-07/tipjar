// Part 1: Setup & Configuration branches
module.exports = [
    {
        name: 'setup/gitignore',
        prTitle: 'chore: add comprehensive gitignore for Stacks and Node project',
        prBody: 'Sets up the .gitignore with exclusions for node_modules, build artifacts, environment files, and Clarity cache directories. This is essential groundwork before we start adding dependencies and building out the project.',
        commits: [
            { file: '.gitignore', mode: 'create', content: '# Dependencies\nnode_modules/\n', msg: 'chore: add node_modules to gitignore' },
            { file: '.gitignore', mode: 'append', content: '.pnp\n.pnp.js\n', msg: 'chore: add pnp files to gitignore' },
            { file: '.gitignore', mode: 'append', content: '\n# Build output\n/build\n/dist\n', msg: 'chore: exclude build and dist directories' },
            { file: '.gitignore', mode: 'append', content: '/out\n/.next/\n', msg: 'chore: ignore next.js output folders' },
            { file: '.gitignore', mode: 'append', content: '\n# Environment\n.env\n.env.local\n.env.production\n', msg: 'chore: exclude environment files from tracking' },
            { file: '.gitignore', mode: 'append', content: '\n# Clarity\n.cache/\nhistory.txt\n', msg: 'chore: ignore clarinet cache and history' },
            { file: '.gitignore', mode: 'append', content: '\n# IDE\n.idea/\n.vscode/\n*.swp\n*.swo\n', msg: 'chore: exclude IDE configuration files' },
            { file: '.gitignore', mode: 'append', content: '\n# OS\n.DS_Store\nThumbs.db\n*.log\n', msg: 'chore: ignore OS-specific metadata files' },
            { file: '.gitignore', mode: 'append', content: '\n# Coverage\ncoverage/\n*.lcov\n', msg: 'chore: exclude test coverage reports' },
            { file: '.gitignore', mode: 'append', content: '\n# Misc\n*.tgz\n.yarn-integrity\n', msg: 'chore: ignore miscellaneous artifacts' },
        ]
    },
    {
        name: 'setup/package-json',
        prTitle: 'chore: initialize package.json with Stacks and WalletConnect dependencies',
        prBody: 'Creates the foundational package.json for the Tipjar project. Includes core dependencies like @stacks/connect and @stacks/transactions for blockchain interaction, @walletconnect packages for universal wallet support, and @hirosystems/chainhooks-client for on-chain event monitoring. Dev dependencies include vitest for testing and eslint for code quality.',
        commits: [
            { file: 'package.json', mode: 'create', content: '{\n  "name": "tipjar",\n  "version": "1.0.0",\n  "description": "A decentralized tipping platform built on Stacks blockchain",\n', msg: 'chore: scaffold package.json with project metadata' },
            { file: 'package.json', mode: 'append', content: '  "main": "src/index.js",\n  "type": "module",\n', msg: 'chore: set entry point and module type' },
            { file: 'package.json', mode: 'append', content: '  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview",\n', msg: 'chore: add dev, build and preview scripts' },
            { file: 'package.json', mode: 'append', content: '    "test": "vitest run",\n    "test:watch": "vitest",\n    "lint": "eslint src/",\n', msg: 'chore: add test and lint scripts' },
            { file: 'package.json', mode: 'append', content: '    "deploy": "node scripts/deploy.js",\n    "seed": "node scripts/seed.js"\n  },\n', msg: 'chore: add deploy and seed scripts' },
            { file: 'package.json', mode: 'append', content: '  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n', msg: 'feat: add react core dependencies' },
            { file: 'package.json', mode: 'append', content: '    "@stacks/connect": "^7.5.0",\n    "@stacks/transactions": "^6.10.0",\n    "@stacks/network": "^6.11.0",\n', msg: 'feat: add stacks blockchain SDK packages' },
            { file: 'package.json', mode: 'append', content: '    "@walletconnect/modal": "^2.6.2",\n    "@walletconnect/sign-client": "^2.11.3",\n    "@walletconnect/utils": "^2.11.3",\n', msg: 'feat: add walletconnect integration packages' },
            { file: 'package.json', mode: 'append', content: '    "@hirosystems/chainhooks-client": "^1.1.0"\n  },\n', msg: 'feat: add hirosystems chainhooks client dependency' },
            { file: 'package.json', mode: 'append', content: '  "devDependencies": {\n    "vite": "^5.0.0",\n    "@vitejs/plugin-react": "^4.2.0",\n    "vitest": "^1.0.0",\n    "eslint": "^8.50.0"\n  }\n}\n', msg: 'chore: add vite, vitest, and eslint dev dependencies' },
        ]
    },
    {
        name: 'setup/clarinet-config',
        prTitle: 'chore: configure Clarinet for Clarity 4 and epoch 3.3',
        prBody: 'Adds the Clarinet.toml project manifest targeting Clarity version 4 and epoch 3.3. Registers three smart contracts: tipjar (the core tipping logic), tip-token (a SIP-010 compliant fungible token for loyalty rewards), and tip-registry (an on-chain registry of creators accepting tips). Analysis passes include the check_checker for static verification.',
        commits: [
            { file: 'Clarinet.toml', mode: 'create', content: '[project]\nname = "tipjar"\ndescription = "Decentralized tipping platform on Stacks"\n', msg: 'chore: initialize Clarinet.toml project section' },
            { file: 'Clarinet.toml', mode: 'append', content: 'authors = []\ntelemetry = true\ncache_dir = "./.cache"\n', msg: 'chore: add project metadata fields' },
            { file: 'Clarinet.toml', mode: 'append', content: 'requirements = []\n\n', msg: 'chore: set empty requirements list' },
            { file: 'Clarinet.toml', mode: 'append', content: '[contracts.tipjar]\npath = "contracts/tipjar.clar"\nclarity_version = 4\nepoch = "3.3"\n\n', msg: 'feat: register tipjar contract with clarity 4' },
            { file: 'Clarinet.toml', mode: 'append', content: '[contracts.tip-token]\npath = "contracts/tip-token.clar"\nclarity_version = 4\nepoch = "3.3"\n\n', msg: 'feat: register tip-token contract with clarity 4' },
            { file: 'Clarinet.toml', mode: 'append', content: '[contracts.tip-registry]\npath = "contracts/tip-registry.clar"\nclarity_version = 4\nepoch = "3.3"\n\n', msg: 'feat: register tip-registry contract with clarity 4' },
            { file: 'Clarinet.toml', mode: 'append', content: '[repl]\nclarity_wasm_mode = false\nshow_timings = false\n\n', msg: 'chore: configure REPL settings' },
            { file: 'Clarinet.toml', mode: 'append', content: '[repl.analysis]\npasses = ["check_checker"]\n\n[repl.analysis.check_checker]\nstrict = false\ntrusted_sender = false\ntrusted_caller = false\ncallee_filter = false\n', msg: 'chore: enable check_checker analysis pass' },
        ]
    },
    {
        name: 'setup/devnet-config',
        prTitle: 'chore: add Devnet settings for local Stacks development',
        prBody: 'Configures the Devnet.toml file with default wallet allocations and network parameters for local testing with clarinet. Includes deployer and wallet addresses with STX allocations so contracts can be tested locally without connecting to testnet.',
        commits: [
            { file: 'settings/Devnet.toml', mode: 'create', content: '[network]\nname = "devnet"\n\n', msg: 'chore: initialize devnet network configuration' },
            { file: 'settings/Devnet.toml', mode: 'append', content: '[accounts.deployer]\nmnemonic = "twice particular affair smile piece dough thrive dismiss invest primary iron opinion wish pig calm spread fence confirm meadow awkward surprise price tumble knee"\nbalance = 100_000_000_000_000\n\n', msg: 'chore: add deployer account with STX balance' },
            { file: 'settings/Devnet.toml', mode: 'append', content: '[accounts.wallet_1]\nmnemonic = "sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild"\nbalance = 100_000_000_000_000\n\n', msg: 'chore: add wallet_1 test account' },
            { file: 'settings/Devnet.toml', mode: 'append', content: '[accounts.wallet_2]\nmnemonic = "hold excess usual excess ring elephant install account animal idle injury canvas lava mean solo decade bounce gather copy decide captain exotic intact leave"\nbalance = 100_000_000_000_000\n\n', msg: 'chore: add wallet_2 test account' },
            { file: 'settings/Devnet.toml', mode: 'append', content: '[accounts.wallet_3]\nmnemonic = "cycle puppy glare enroll cost improve round trend wrist mushroom scorpion tower claim oppose clever elephant dinosaur eight problem before frozen dune wagon high"\nbalance = 100_000_000_000_000\n', msg: 'chore: add wallet_3 test account' },
        ]
    },
    {
        name: 'setup/env-example',
        prTitle: 'docs: provide .env.example template for project configuration',
        prBody: 'Adds an environment variable template to help developers set up their local environment quickly. Includes placeholders for the Stacks network URL, WalletConnect project ID, Chainhooks API key, and contract deployer address. No secrets are committed — only the template file.',
        commits: [
            { file: '.env.example', mode: 'create', content: '# Stacks Network Configuration\nSTACKS_NETWORK=testnet\nSTACKS_API_URL=https://api.testnet.hiro.so\n', msg: 'docs: add stacks network env variables template' },
            { file: '.env.example', mode: 'append', content: '\n# WalletConnect\nWALLETCONNECT_PROJECT_ID=your_project_id_here\n', msg: 'docs: add walletconnect project id placeholder' },
            { file: '.env.example', mode: 'append', content: '\n# Chainhooks\nCHAINHOOKS_API_KEY=your_api_key_here\nCHAINHOOKS_WEBHOOK_URL=http://localhost:3001/webhooks\n', msg: 'docs: add chainhooks configuration placeholders' },
            { file: '.env.example', mode: 'append', content: '\n# Contract Deployment\nDEPLOYER_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM\nCONTRACT_NAME=tipjar\n', msg: 'docs: add contract deployment env variables' },
            { file: '.env.example', mode: 'append', content: '\n# Application\nPORT=3000\nNODE_ENV=development\n', msg: 'docs: add application runtime env variables' },
        ]
    },
    {
        name: 'setup/network-config',
        prTitle: 'feat: create Stacks network configuration module',
        prBody: 'Implements the network configuration module that exports pre-configured Stacks network instances for mainnet, testnet, and devnet. Other modules import from here rather than instantiating network objects themselves, keeping network selection centralized.',
        commits: [
            { file: 'src/config/network.js', mode: 'create', content: '// Network configuration for Stacks blockchain\n', msg: 'feat: create network configuration file' },
            { file: 'src/config/network.js', mode: 'append', content: 'import { StacksMainnet, StacksTestnet, StacksDevnet } from \'@stacks/network\';\n\n', msg: 'feat: import stacks network classes' },
            { file: 'src/config/network.js', mode: 'append', content: 'export const NETWORK_CONFIG = {\n  mainnet: new StacksMainnet(),\n  testnet: new StacksTestnet(),\n  devnet: new StacksDevnet(),\n};\n\n', msg: 'feat: define network configuration map' },
            { file: 'src/config/network.js', mode: 'append', content: 'export function getNetwork(env = \'testnet\') {\n  return NETWORK_CONFIG[env] || NETWORK_CONFIG.testnet;\n}\n\n', msg: 'feat: add getNetwork selector function' },
            { file: 'src/config/network.js', mode: 'append', content: 'export const DEFAULT_NETWORK = getNetwork(process.env.STACKS_NETWORK || \'testnet\');\n\n', msg: 'feat: export default network from environment' },
            { file: 'src/config/network.js', mode: 'append', content: 'export const API_URL = process.env.STACKS_API_URL || \'https://api.testnet.hiro.so\';\n', msg: 'feat: export configurable API base URL' },
        ]
    },
    {
        name: 'setup/walletconnect-config',
        prTitle: 'feat: add WalletConnect configuration with project metadata',
        prBody: 'Creates the WalletConnect configuration module that stores the project metadata (name, description, url, icons) and the WC project ID pulled from environment variables. This config is consumed by the WalletConnect service to initialize the sign client and modal.',
        commits: [
            { file: 'src/config/walletConnect.js', mode: 'create', content: '// WalletConnect configuration\n\n', msg: 'feat: create walletconnect config file' },
            { file: 'src/config/walletConnect.js', mode: 'append', content: 'export const WC_PROJECT_ID = process.env.WALLETCONNECT_PROJECT_ID || \'\';\n\n', msg: 'feat: export walletconnect project id from env' },
            { file: 'src/config/walletConnect.js', mode: 'append', content: 'export const WC_METADATA = {\n  name: \'Tipjar\',\n  description: \'Decentralized tipping platform built on Stacks\',\n  url: \'https://tipjar.app\',\n  icons: [\'https://tipjar.app/icon.png\'],\n};\n\n', msg: 'feat: define walletconnect project metadata' },
            { file: 'src/config/walletConnect.js', mode: 'append', content: 'export const WC_REQUIRED_NAMESPACES = {\n  stacks: {\n    methods: [\'stacks_signMessage\', \'stacks_stxTransfer\', \'stacks_contractCall\'],\n    chains: [\'stacks:1\'],\n    events: [\'chainChanged\', \'accountsChanged\'],\n  },\n};\n', msg: 'feat: define required WalletConnect namespaces for Stacks' },
        ]
    },
];
