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

function setupEventListeners() {
  signClient.on('session_event', ({ event }) => {
    console.log('Session event:', event);
  });

  signClient.on('session_update', ({ topic, params }) => {
    const { namespaces } = params;
    const session = signClient.session.get(topic);
    currentSession = { ...session, namespaces };
  });

  signClient.on('session_delete', () => {
    console.log('Session deleted');
    currentSession = null;
  });
}

export async function connectWallet() {
  const { uri, approval } = await signClient.connect({
    requiredNamespaces: WC_REQUIRED_NAMESPACES,
  });

  if (uri) {
    walletConnectModal.openModal({ uri });
  }

  currentSession = await approval();
  walletConnectModal.closeModal();
  return currentSession;
}

export async function disconnectWallet() {
  if (currentSession) {
    await signClient.disconnect({
      topic: currentSession.topic,
      reason: { code: 6000, message: 'User disconnected' },
    });
    currentSession = null;
  }
}

export async function requestStxTransfer(recipient, amount) {
  if (!currentSession) throw new Error('No active session');
  const result = await signClient.request({
    topic: currentSession.topic,
    chainId: 'stacks:1',
    request: {
      method: 'stacks_stxTransfer',
      params: { recipient, amount: amount.toString() },
    },
  });
  return result;
}

export function getSession() {
  return currentSession;
}

export function isConnected() {
  return currentSession !== null;
}
