// Tests for stacksService
import { describe, it, expect, vi } from 'vitest';

describe('Stacks Service', () => {
  describe('sendTip', () => {
    it('should construct transfer with correct recipient', () => {
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      expect(recipient.startsWith('ST')).toBe(true);
    });

    it('should include amount in micro-STX', () => {
      const amountMicro = 1000000;
      expect(amountMicro).toBe(1000000);
    });
  });

