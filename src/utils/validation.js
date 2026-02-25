// Input validation utilities

import { MIN_TIP_MICRO, MAX_TIP_MICRO } from './constants.js';

export function validateStxAddress(address) {
  if (!address) return { valid: false, error: 'Address is required' };
  if (!address.startsWith('ST') && !address.startsWith('SP')) return { valid: false, error: 'Address must start with ST or SP' };
  if (address.length < 30 || address.length > 42) return { valid: false, error: 'Invalid address length' };
  return { valid: true, error: null };
}

export function validateTipAmount(amountMicro) {
  if (isNaN(amountMicro) || amountMicro <= 0) return { valid: false, error: 'Amount must be positive' };
  if (amountMicro < MIN_TIP_MICRO) return { valid: false, error: 'Amount below minimum tip' };
  if (amountMicro > MAX_TIP_MICRO) return { valid: false, error: 'Amount exceeds maximum tip' };
  return { valid: true, error: null };
}

export function validateMemo(memo) {
  if (memo && memo.length > 34) return { valid: false, error: 'Memo must be 34 characters or less' };
  return { valid: true, error: null };
}

