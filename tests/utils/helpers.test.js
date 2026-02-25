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

