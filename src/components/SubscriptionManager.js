import React, { useState, useCallback } from 'react';
import useWallet from '../hooks/useWallet.js';
import { formatStx } from '../utils/helpers.js';

// Subscription tier card
function TierCard({ tier, onSubscribe, isSubscribed }) {
  const tierColors = {
    Bronze: { gradient: 'linear-gradient(135deg, #cd7f32, #8B6914)', icon: '🥉' },
    Silver: { gradient: 'linear-gradient(135deg, #c0c0c0, #808080)', icon: '🥈' },
    Gold: { gradient: 'linear-gradient(135deg, #ffd700, #ffb300)', icon: '🥇' },
    Platinum: { gradient: 'linear-gradient(135deg, #e5e4e2, #c0c0c0)', icon: '💎' },
  };
  
  const style = tierColors[tier.name] || tierColors.Bronze;
  
  return React.createElement('div', {
    className: `tier-card ${isSubscribed ? 'subscribed' : ''}`,
  },
    React.createElement('div', {
      className: 'tier-header',
      style: { background: style.gradient }
    },
      React.createElement('span', { className: 'tier-icon' }, style.icon),
      React.createElement('h3', null, tier.name)
    ),
    React.createElement('div', { className: 'tier-body' },
      React.createElement('div', { className: 'tier-price' },
        React.createElement('span', { className: 'price-amount' }, formatStx(tier.amount)),
        React.createElement('span', { className: 'price-period' }, ' STX/epoch')
      ),
      React.createElement('p', { className: 'tier-perks' }, tier.perks),
      React.createElement('div', { className: 'tier-stats' },
        React.createElement('span', null, `${tier.subscriberCount || 0} subscribers`)
      ),
      React.createElement('button', {
        className: isSubscribed ? 'btn-unsubscribe' : 'btn-subscribe',
        onClick: () => onSubscribe(tier)
      }, isSubscribed ? 'Unsubscribe' : 'Subscribe')
    )
  );
}

