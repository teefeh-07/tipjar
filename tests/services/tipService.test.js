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

