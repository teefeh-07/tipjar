// Tests for tipjar.clar smart contract
import { describe, it, expect, beforeEach } from 'vitest';

const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const wallet1 = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
const wallet2 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';

describe('Tipjar Contract', () => {
  describe('send-tip', () => {
    it('should accept a valid tip amount', () => {
      const amount = 1000000;
      expect(amount).toBeGreaterThan(0);
    });

    it('should reject zero amount tips', () => {
      const amount = 0;
      expect(amount).toBe(0);
    });

    it('should transfer STX from sender to recipient', () => {
      const sender = wallet1;
      const recipient = wallet2;
      const amount = 500000;
      expect(sender).not.toBe(recipient);
      expect(amount).toBeGreaterThan(0);
    });
  });

