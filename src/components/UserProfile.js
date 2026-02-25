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

// Badge collection grid
function BadgeCollection({ badges }) {
  if (!badges || badges.length === 0) {
    return React.createElement('div', { className: 'badges-empty' },
      React.createElement('p', null, 'No badges earned yet. Start tipping to earn your first badge! 🎯')
    );
  }
  
  return React.createElement('div', { className: 'badges-section' },
    React.createElement('h3', null, '🏅 Badge Collection'),
    React.createElement('div', { className: 'badges-grid' },
      badges.map((badge, i) =>
        React.createElement('div', {
          key: i,
          className: 'badge-card',
          title: badge.description
        },
          React.createElement('div', { className: 'badge-icon' }, badge.emoji || '🏅'),
          React.createElement('div', { className: 'badge-name' }, badge.name),
          React.createElement('div', { className: 'badge-date' }, badge.earnedDate || 'Recently')
        )
      )
    )
  );
}

// Activity timeline component
function ActivityTimeline({ activities }) {
  return React.createElement('div', { className: 'timeline-section' },
    React.createElement('h3', null, '📋 Recent Activity'),
    React.createElement('div', { className: 'timeline' },
      (activities || []).slice(0, 20).map((activity, i) =>
        React.createElement('div', {
          key: i,
          className: `timeline-entry ${i % 2 === 0 ? 'left' : 'right'}`
        },
          React.createElement('div', { className: 'timeline-dot' }),
          React.createElement('div', { className: 'timeline-content' },
            React.createElement('div', { className: 'timeline-type' }, activity.type),
            React.createElement('div', { className: 'timeline-desc' }, activity.description),
            React.createElement('div', { className: 'timeline-time' }, activity.time)
          )
        )
      )
    )
  );
}

// Main UserProfile component
export default function UserProfile() {
  const { connected, address, provider } = useWallet();
  const [reputation, setReputation] = useState({ totalScore: 0, tier: 'newcomer', tipScore: 0, consistencyScore: 0, receivingScore: 0, governanceScore: 0, badgeScore: 0 });
  const [badges, setBadges] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const tierStyle = TIER_STYLES[reputation.tier] || TIER_STYLES.newcomer;
  
  if (!connected) {
    return React.createElement('div', { className: 'profile-connect-prompt' },
      React.createElement('h2', null, 'Connect your wallet to view your profile'),
      React.createElement('p', null, 'Your reputation, badges, and activity will appear here.')
    );
  }
  
  return React.createElement('div', { className: 'user-profile' },
    // Profile Header
    React.createElement('div', { className: 'profile-header' },
      React.createElement('div', {
        className: 'profile-avatar',
        style: { background: getAvatarGradient(address) }
      }, address ? address.slice(0, 2) : '?'),
      React.createElement('div', { className: 'profile-info' },
        React.createElement('h2', { className: 'profile-address' }, truncateAddress(address)),
        React.createElement('div', {
          className: 'profile-tier',
          style: { color: tierStyle.color }
        }, `${tierStyle.icon} ${tierStyle.label} · Score: ${reputation.totalScore}`),
        React.createElement('div', { className: 'profile-provider' }, `Connected via ${provider || 'wallet'}`)
      )
    ),
    // Reputation breakdown
    React.createElement(ReputationBreakdown, { scores: reputation }),
    // Badge collection
    React.createElement(BadgeCollection, { badges }),
    // Activity timeline
    React.createElement(ActivityTimeline, { activities })
  );
}
