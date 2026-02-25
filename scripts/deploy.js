// Contract deployment script
// Automates Clarity contract deployment to Stacks

import fs from 'fs';
import path from 'path';
import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const CONTRACTS = [
  { name: 'tipjar', file: 'contracts/tipjar.clar' },
  { name: 'tip-token', file: 'contracts/tip-token.clar' },
  { name: 'tip-registry', file: 'contracts/tip-registry.clar' },
  { name: 'tip-rewards', file: 'contracts/tip-rewards.clar' },
  { name: 'tip-governance', file: 'contracts/tip-governance.clar' },
];

