import React, { useState, useEffect } from 'react';
import useWallet from '../hooks/useWallet.js';
import { truncateAddress, formatStx } from '../utils/helpers.js';

// Generate deterministic avatar color from address
function getAvatarGradient(address) {
  if (!address) return 'linear-gradient(135deg, #667eea, #764ba2)';
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 7) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
}

// Reputation tier styling
const TIER_STYLES = {
  newcomer: { label: 'Newcomer', color: '#94a3b8', icon: '🌱' },
  bronze: { label: 'Bronze', color: '#cd7f32', icon: '🥉' },
  silver: { label: 'Silver', color: '#c0c0c0', icon: '🥈' },
  gold: { label: 'Gold', color: '#ffd700', icon: '🥇' },
  legendary: { label: 'Legendary', color: '#ff6b6b', icon: '👑' },
};

