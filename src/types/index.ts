// Type definitions for Tipjar project

export interface Tip {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  memo: string;
  timestamp: string;
  txId: string | null;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Creator {
  address: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
  totalReceived: number;
  tipCount: number;
}

export interface TipStats {
  totalTips: number;
  totalAmount: number;
  uniqueRecipients: number;
  averageTip: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  provider: 'hiro' | 'walletconnect' | null;
}

