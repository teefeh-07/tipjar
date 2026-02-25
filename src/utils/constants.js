// Application-wide constants

export const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const TIPJAR_CONTRACT = 'tipjar';
export const TOKEN_CONTRACT = 'tip-token';
export const REGISTRY_CONTRACT = 'tip-registry';

export const MICRO_STX = 1000000;
export const MIN_TIP_STX = 0.001;
export const MAX_TIP_STX = 100;
export const MIN_TIP_MICRO = MIN_TIP_STX * MICRO_STX;
export const MAX_TIP_MICRO = MAX_TIP_STX * MICRO_STX;

export const NETWORKS = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  DEVNET: 'devnet',
};

export const TX_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  DROPPED: 'dropped',
};

export const APP_NAME = 'Tipjar';
export const APP_VERSION = '1.0.0';
export const REFRESH_INTERVAL = 10000;
