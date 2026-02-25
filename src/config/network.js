// Network configuration for Stacks blockchain
import { StacksMainnet, StacksTestnet, StacksDevnet } from '@stacks/network';

export const NETWORK_CONFIG = {
  mainnet: new StacksMainnet(),
  testnet: new StacksTestnet(),
  devnet: new StacksDevnet(),
};

export function getNetwork(env = 'testnet') {
  return NETWORK_CONFIG[env] || NETWORK_CONFIG.testnet;
}

export const DEFAULT_NETWORK = getNetwork(process.env.STACKS_NETWORK || 'testnet');

