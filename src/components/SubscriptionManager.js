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

// Create tier form
function CreateTierForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [perks, setPerks] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, amount: parseInt(amount), perks });
    setName('');
    setAmount('');
    setPerks('');
  };
  
  return React.createElement('form', {
    className: 'create-tier-form',
    onSubmit: handleSubmit
  },
    React.createElement('h3', null, '➕ Create Subscription Tier'),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Tier Name'),
      React.createElement('input', {
        type: 'text', value: name, placeholder: 'e.g., Gold',
        onChange: (e) => setName(e.target.value), required: true
      })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Amount per Epoch (μSTX)'),
      React.createElement('input', {
        type: 'number', value: amount, placeholder: '1000000',
        onChange: (e) => setAmount(e.target.value), required: true, min: '1'
      })
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Perks Description'),
      React.createElement('textarea', {
        value: perks, placeholder: 'Describe the perks for this tier...',
        onChange: (e) => setPerks(e.target.value), required: true, rows: 3
      })
    ),
    React.createElement('button', { type: 'submit', className: 'btn-create-tier' }, 'Create Tier')
  );
}

