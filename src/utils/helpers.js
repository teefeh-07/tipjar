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

export function formatStx(microStx, decimals = 6) {
  return microToStx(microStx).toFixed(decimals);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function debounce(fn, delayMs = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
