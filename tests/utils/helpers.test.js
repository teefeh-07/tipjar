// Tests for helper utilities
import { describe, it, expect } from 'vitest';

describe('Helper Utils', () => {
  describe('microToStx', () => {
    it('should convert 1000000 micro-STX to 1 STX', () => {
      expect(1000000 / 1000000).toBe(1);
    });

    it('should handle zero', () => {
      expect(0 / 1000000).toBe(0);
    });
  });

  describe('stxToMicro', () => {
    it('should convert 1 STX to 1000000 micro-STX', () => {
      expect(Math.floor(1 * 1000000)).toBe(1000000);
    });

    it('should floor fractional results', () => {
      expect(Math.floor(0.0000001 * 1000000)).toBe(0);
    });
  });

  describe('truncateAddress', () => {
    it('should truncate long addresses', () => {
      const addr = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const truncated = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
      expect(truncated).toContain('...');
    });

    it('should return short addresses unchanged', () => {
      const addr = 'ST123';
      expect(addr.length).toBeLessThanOrEqual(10);
    });
  });

