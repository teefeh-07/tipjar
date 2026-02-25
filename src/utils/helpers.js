// Utility helper functions

import { MICRO_STX } from './constants.js';

export function microToStx(microStx) {
  return Number(microStx) / MICRO_STX;
}

export function stxToMicro(stx) {
  return Math.floor(Number(stx) * MICRO_STX);
}

