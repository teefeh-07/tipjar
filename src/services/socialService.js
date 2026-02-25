// Social Sharing and Tip Receipt Generation Service

import { truncateAddress, formatStx } from '../utils/helpers.js';
import { APP_NAME } from '../utils/constants.js';

// Social platform configurations
const PLATFORMS = {
  twitter: {
    name: 'Twitter/X',
    shareUrl: 'https://twitter.com/intent/tweet',
    maxLength: 280,
  },
  farcaster: {
    name: 'Farcaster',
    shareUrl: 'https://warpcast.com/~/compose',
    maxLength: 320,
  },
  discord: {
    name: 'Discord',
    shareUrl: null, // Copy to clipboard for Discord
    maxLength: 2000,
  },
};

