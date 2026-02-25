// Stacks blockchain interaction service
// Wraps @stacks/transactions and @stacks/connect

import {
  makeSTXTokenTransfer,
  makeContractCall,
  callReadOnlyFunction,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  principalCV,
  standardPrincipalCV,
  bufferCVFromString,
} from '@stacks/transactions';

import { openSTXTransfer, openContractCall } from '@stacks/connect';
import { DEFAULT_NETWORK, API_URL } from '../config/network.js';

const CONTRACT_ADDRESS = process.env.DEPLOYER_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'tipjar';

