// Utility helper functions

import { MICRO_STX } from './constants.js';

export function microToStx(microStx) {
  return Number(microStx) / MICRO_STX;
}

export function stxToMicro(stx) {
  return Math.floor(Number(stx) * MICRO_STX);
}

export function truncateAddress(address, startChars = 6, endChars = 4) {
  if (!address || address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

