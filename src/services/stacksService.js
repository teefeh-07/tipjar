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

export async function sendTip(recipientAddress, amountInMicroStx) {
  const options = {
    recipient: recipientAddress,
    amount: amountInMicroStx,
    memo: 'Tip via Tipjar',
    network: DEFAULT_NETWORK,
    anchorMode: AnchorMode.Any,
    onFinish: (data) => {
      console.log('Transaction submitted:', data.txId);
      return data;
    },
  };
  return openSTXTransfer(options);
}

export async function registerCreator(name, description, category) {
  const options = {
    network: DEFAULT_NETWORK,
    anchorMode: AnchorMode.Any,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'tip-registry',
    functionName: 'register',
    functionArgs: [
      bufferCVFromString(name),
      bufferCVFromString(description),
      bufferCVFromString(category),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish: (data) => console.log('Registered:', data.txId),
  };
  return openContractCall(options);
}

