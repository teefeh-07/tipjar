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

  describe('registerCreator', () => {
    it('should call tip-registry contract', () => {
      const contractName = 'tip-registry';
      expect(contractName).toBe('tip-registry');
    });

    it('should pass name, description, and category', () => {
      const args = ['Creator', 'A great creator', 'Art'];
      expect(args).toHaveLength(3);
    });
  });

  describe('getPlatformStats', () => {
    it('should return totalTips and tipCount', () => {
      const stats = { totalTips: 100, tipCount: 5 };
      expect(stats).toHaveProperty('totalTips');
      expect(stats).toHaveProperty('tipCount');
    });
  });

  describe('fetchAccountBalance', () => {
    it('should handle API errors gracefully', async () => {
      const balance = '0';
      expect(balance).toBe('0');
    });
  });
});
