// WalletConnect configuration

export const WC_PROJECT_ID = process.env.WALLETCONNECT_PROJECT_ID || '';

export const WC_METADATA = {
  name: 'Tipjar',
  description: 'Decentralized tipping platform built on Stacks',
  url: 'https://tipjar.app',
  icons: ['https://tipjar.app/icon.png'],
};

export const WC_REQUIRED_NAMESPACES = {
  stacks: {
    methods: ['stacks_signMessage', 'stacks_stxTransfer', 'stacks_contractCall'],
    chains: ['stacks:1'],
    events: ['chainChanged', 'accountsChanged'],
  },
};
