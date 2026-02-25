import React, { useState, useEffect, useCallback } from 'react';

// Settings schema with defaults
const DEFAULT_SETTINGS = {
  version: 1,
  general: {
    theme: 'dark',
    language: 'en',
    currencyFormat: 'STX',
    animationsEnabled: true,
  },
  notifications: {
    tipReceived: true,
    tipSent: true,
    badgeEarned: true,
    governanceProposal: true,
    subscriptionRenewal: true,
    weeklyDigest: false,
  },
  privacy: {
    analyticsOptIn: true,
    publicProfile: true,
    showActivityFeed: true,
    showBadges: true,
  },
};

// Load settings from localStorage
function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem('tipjar_settings'));
    if (stored && stored.version === DEFAULT_SETTINGS.version) {
      return { ...DEFAULT_SETTINGS, ...stored };
    }
  } catch (err) {
    console.warn('Failed to load settings:', err);
  }
  return { ...DEFAULT_SETTINGS };
}

// Save settings to localStorage
function saveSettings(settings) {
  try {
    localStorage.setItem('tipjar_settings', JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}

// Toggle switch component
function ToggleSwitch({ id, label, checked, onChange, description }) {
  return React.createElement('div', { className: 'setting-toggle' },
    React.createElement('div', { className: 'setting-toggle-info' },
      React.createElement('label', { htmlFor: id }, label),
      description && React.createElement('p', { className: 'setting-description' }, description)
    ),
    React.createElement('button', {
      id,
      role: 'switch',
      'aria-checked': checked,
      className: `toggle-switch ${checked ? 'active' : ''}`,
      onClick: () => onChange(!checked)
    },
      React.createElement('span', { className: 'toggle-thumb' })
    )
  );
}

// Select dropdown component
function SelectSetting({ id, label, value, options, onChange }) {
  return React.createElement('div', { className: 'setting-select' },
    React.createElement('label', { htmlFor: id }, label),
    React.createElement('select', {
      id, value,
      onChange: (e) => onChange(e.target.value)
    },
      options.map(opt =>
        React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
      )
    )
  );
}

