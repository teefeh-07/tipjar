// WalletConnect integration service
// Multi-wallet support via WalletConnect protocol

import SignClient from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';
import { WC_PROJECT_ID, WC_METADATA, WC_REQUIRED_NAMESPACES } from '../config/walletConnect.js';

let signClient = null;
let currentSession = null;
let walletConnectModal = null;

export async function initWalletConnect() {
  signClient = await SignClient.init({
    projectId: WC_PROJECT_ID,
    metadata: WC_METADATA,
  });

  walletConnectModal = new WalletConnectModal({
    projectId: WC_PROJECT_ID,
    chains: ['stacks:1'],
  });

  setupEventListeners();
  return signClient;
}

