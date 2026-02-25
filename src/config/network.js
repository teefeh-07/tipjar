// Network configuration for Stacks blockchain
import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network';

export const NETWORK_CONFIG = {
  mainnet: new StacksMainnet(),
  testnet: new StacksTestnet(),
  devnet: new StacksDevnet(),
};

