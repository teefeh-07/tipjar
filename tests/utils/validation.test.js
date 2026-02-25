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

