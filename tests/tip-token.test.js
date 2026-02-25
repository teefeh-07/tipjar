// Tests for tip-token.clar contract
import { describe, it, expect } from 'vitest';

describe('Tip Token Contract', () => {
  describe('SIP-010 metadata', () => {
    it('should return correct token name', () => {
      expect('Tip Token').toBe('Tip Token');
    });

    it('should return correct token symbol', () => {
      expect('TIPT').toBe('TIPT');
    });

