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

// Reputation breakdown component
function ReputationBreakdown({ scores }) {
  const categories = [
    { name: 'Tipping', value: scores.tipScore, max: 100, color: '#7c3aed' },
    { name: 'Consistency', value: scores.consistencyScore, max: 50, color: '#06d6a0' },
    { name: 'Receiving', value: scores.receivingScore, max: 100, color: '#3396ff' },
    { name: 'Governance', value: scores.governanceScore, max: 50, color: '#f59e0b' },
    { name: 'Badges', value: scores.badgeScore, max: 100, color: '#ef4444' },
  ];
  
  return React.createElement('div', { className: 'reputation-breakdown' },
    React.createElement('h3', null, 'Reputation Breakdown'),
    categories.map(cat =>
      React.createElement('div', { key: cat.name, className: 'rep-category' },
        React.createElement('div', { className: 'rep-category-header' },
          React.createElement('span', null, cat.name),
          React.createElement('span', null, `${cat.value}/${cat.max}`)
        ),
        React.createElement('div', { className: 'rep-bar-track' },
          React.createElement('div', {
            className: 'rep-bar-fill',
            style: {
              width: `${(cat.value / cat.max) * 100}%`,
              backgroundColor: cat.color
            }
          })
        )
      )
    )
  );
}

