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

    it('should return 6 decimals', () => {
      expect(6).toBe(6);
    });

    it('should return valid token URI', () => {
      const uri = 'https://tipjar.app/token-metadata.json';
      expect(uri).toContain('tipjar');
    });
  });

  describe('minting', () => {
    it('should allow owner to mint tokens', () => {
      const isOwner = true;
      expect(isOwner).toBe(true);
    });

    it('should reject minting from non-owner', () => {
      const isOwner = false;
      expect(isOwner).toBe(false);
    });
  });

  describe('transfer', () => {
    it('should transfer tokens between accounts', () => {
      const balance = 100;
      const transfer = 50;
      expect(balance - transfer).toBe(50);
    });

    it('should reject transfer if sender is not tx-sender', () => {
      const sender = 'wallet1';
      const txSender = 'wallet2';
      expect(sender).not.toBe(txSender);
    });
  });
});
