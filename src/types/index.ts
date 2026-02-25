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

