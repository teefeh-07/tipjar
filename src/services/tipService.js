// Tip orchestration service
// Manages tipping flow, history, and analytics

import { sendTip as stacksSendTip, getTipAmount } from './stacksService.js';

const tipHistory = [];
const TIP_MIN = 1000; // 0.001 STX in micro-STX
const TIP_MAX = 100000000; // 100 STX

export function validateTip(amount, recipient) {
  if (!recipient || recipient.length < 30) return { valid: false, error: 'Invalid recipient address' };
  if (amount < TIP_MIN) return { valid: false, error: `Minimum tip is ${TIP_MIN / 1000000} STX` };
  if (amount > TIP_MAX) return { valid: false, error: `Maximum tip is ${TIP_MAX / 1000000} STX` };
  return { valid: true, error: null };
}

export async function processTip(recipient, amount, memo = '') {
  const validation = validateTip(amount, recipient);
  if (!validation.valid) throw new Error(validation.error);

  const result = await stacksSendTip(recipient, amount.toString());

  const tipRecord = {
    id: Date.now().toString(36),
    recipient,
    amount,
    memo,
    timestamp: new Date().toISOString(),
    txId: result?.txId || null,
    status: 'pending',
  };

  tipHistory.push(tipRecord);
  return tipRecord;
}

