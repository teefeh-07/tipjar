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

// Settings section component
function SettingsSection({ title, icon, children }) {
  const [expanded, setExpanded] = useState(true);
  
  return React.createElement('div', { className: 'settings-section' },
    React.createElement('button', {
      className: 'section-header',
      onClick: () => setExpanded(!expanded)
    },
      React.createElement('span', null, `${icon} ${title}`),
      React.createElement('span', { className: 'section-chevron' }, expanded ? '▼' : '▶')
    ),
    expanded && React.createElement('div', { className: 'section-content' }, children)
  );
}

// Main SettingsPanel component
export default function SettingsPanel() {
  const [settings, setSettings] = useState(loadSettings());
  const [saved, setSaved] = useState(false);
  
  const updateSetting = useCallback((section, key, value) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        [section]: { ...prev[section], [key]: value }
      };
      saveSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return updated;
    });
  }, []);
  
  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);
  
  const exportData = useCallback(() => {
    const data = {
      settings,
      analytics: JSON.parse(localStorage.getItem('tipjar_analytics') || '[]'),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tipjar-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  return React.createElement('div', { className: 'settings-panel' },
    React.createElement('div', { className: 'settings-header' },
      React.createElement('h2', null, '⚙️ Settings'),
      saved && React.createElement('span', { className: 'save-indicator' }, '✓ Saved')
    ),
    // General settings
    React.createElement(SettingsSection, { title: 'General', icon: '🎨' },
      React.createElement(SelectSetting, {
        id: 'theme', label: 'Theme', value: settings.general.theme,
        options: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'auto', label: 'System' }],
        onChange: (v) => updateSetting('general', 'theme', v)
      }),
      React.createElement(ToggleSwitch, {
        id: 'animations', label: 'Animations', checked: settings.general.animationsEnabled,
        description: 'Enable smooth transitions and animations',
        onChange: (v) => updateSetting('general', 'animationsEnabled', v)
      })
    ),
    // Notification settings
    React.createElement(SettingsSection, { title: 'Notifications', icon: '🔔' },
      Object.entries(settings.notifications).map(([key, value]) =>
        React.createElement(ToggleSwitch, {
          key, id: `notif-${key}`, label: key.replace(/([A-Z])/g, ' $1').trim(),
          checked: value,
          onChange: (v) => updateSetting('notifications', key, v)
        })
      )
    ),
    // Privacy settings
    React.createElement(SettingsSection, { title: 'Privacy', icon: '🔒' },
      Object.entries(settings.privacy).map(([key, value]) =>
        React.createElement(ToggleSwitch, {
          key, id: `privacy-${key}`, label: key.replace(/([A-Z])/g, ' $1').trim(),
          checked: value,
          onChange: (v) => updateSetting('privacy', key, v)
        })
      )
    ),
    // Advanced
    React.createElement(SettingsSection, { title: 'Advanced', icon: '🔧' },
      React.createElement('button', { className: 'btn-export', onClick: exportData }, '📦 Export All Data'),
      React.createElement('button', { className: 'btn-reset', onClick: resetSettings }, '🔄 Reset to Defaults')
    )
  );
}
