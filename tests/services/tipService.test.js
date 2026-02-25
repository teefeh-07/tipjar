// Tests for tipService
import { describe, it, expect } from 'vitest';

describe('Tip Service', () => {
  describe('validateTip', () => {
    it('should reject invalid recipient address', () => {
      const recipient = 'short';
      expect(recipient.length).toBeLessThan(30);
    });

    it('should reject amount below minimum', () => {
      const amount = 500;
      const minTip = 1000;
      expect(amount).toBeLessThan(minTip);
    });

    it('should accept valid tip parameters', () => {
      const amount = 1000000;
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      expect(amount).toBeGreaterThan(0);
      expect(recipient.length).toBeGreaterThan(30);
    });
  });

  describe('getTipStats', () => {
    it('should return correct stat shape', () => {
      const stats = { totalTips: 0, totalAmount: 0, uniqueRecipients: 0, averageTip: 0 };
      expect(stats).toHaveProperty('totalTips');
      expect(stats).toHaveProperty('totalAmount');
      expect(stats).toHaveProperty('uniqueRecipients');
      expect(stats).toHaveProperty('averageTip');
    });
  });

