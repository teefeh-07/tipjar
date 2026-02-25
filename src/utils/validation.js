// Input validation utilities

import { MIN_TIP_MICRO, MAX_TIP_MICRO } from './constants.js';

export function validateStxAddress(address) {
  if (!address) return { valid: false, error: 'Address is required' };
  if (!address.startsWith('ST') && !address.startsWith('SP')) return { valid: false, error: 'Address must start with ST or SP' };
  if (address.length < 30 || address.length > 42) return { valid: false, error: 'Invalid address length' };
  return { valid: true, error: null };
}

