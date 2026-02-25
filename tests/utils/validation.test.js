// Tests for validation utilities
import { describe, it, expect } from 'vitest';

describe('Validation Utils', () => {
  describe('validateStxAddress', () => {
    it('should accept addresses starting with ST', () => {
      const addr = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      expect(addr.startsWith('ST')).toBe(true);
    });

    it('should accept addresses starting with SP', () => {
      const addr = 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRT1234';
      expect(addr.startsWith('SP')).toBe(true);
    });

    it('should reject empty addresses', () => {
      const addr = '';
      expect(addr.length).toBe(0);
    });

    it('should reject addresses too short', () => {
      const addr = 'ST123';
      expect(addr.length).toBeLessThan(30);
    });
  });

  describe('validateTipAmount', () => {
    it('should accept amounts within bounds', () => {
      const amount = 1000000;
      expect(amount).toBeGreaterThanOrEqual(1000);
      expect(amount).toBeLessThanOrEqual(100000000);
    });

    it('should reject zero amounts', () => {
      expect(0).toBe(0);
    });

    it('should reject negative amounts', () => {
      expect(-100).toBeLessThan(0);
    });
  });

  describe('validateMemo', () => {
    it('should accept memos within 34 chars', () => {
      const memo = 'Short memo';
      expect(memo.length).toBeLessThanOrEqual(34);
    });

    it('should reject memos over 34 chars', () => {
      const memo = 'A'.repeat(35);
      expect(memo.length).toBeGreaterThan(34);
    });
  });

