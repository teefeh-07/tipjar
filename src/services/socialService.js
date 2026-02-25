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

// Generate tip receipt data
export function generateTipReceipt(tipData) {
  const { sender, recipient, amount, memo, txId, timestamp } = tipData;
  
  return {
    id: `receipt_${Date.now()}`,
    sender: truncateAddress(sender),
    recipient: truncateAddress(recipient),
    amount: formatStx(amount),
    memo: memo || 'No memo',
    txId,
    timestamp: new Date(timestamp).toLocaleString(),
    appName: APP_NAME,
    receiptUrl: `https://tipjar.app/tx/${txId}`,
  };
}

// Generate share text for a tip
export function generateTipShareText(receipt, platform = 'twitter') {
  const texts = {
    twitter: `🎉 Just tipped ${receipt.recipient} ${receipt.amount} STX on ${APP_NAME}!\n\nSupporting creators on the Stacks blockchain 🧡\n\n${receipt.receiptUrl}`,
    farcaster: `Tipped ${receipt.recipient} ${receipt.amount} STX on ${APP_NAME} 🎉\n\n${receipt.receiptUrl}`,
    discord: `**🎉 Tip Sent via ${APP_NAME}**\n> **To:** ${receipt.recipient}\n> **Amount:** ${receipt.amount} STX\n> **Memo:** ${receipt.memo}\n> **TX:** ${receipt.receiptUrl}`,
  };
  return texts[platform] || texts.twitter;
}

// Generate share URL for social platforms
export function getShareUrl(text, platform = 'twitter') {
  const config = PLATFORMS[platform];
  if (!config || !config.shareUrl) return null;
  
  const params = new URLSearchParams();
  if (platform === 'twitter') {
    params.set('text', text);
  } else if (platform === 'farcaster') {
    params.set('text', text);
  }
  
  return `${config.shareUrl}?${params.toString()}`;
}

// Share to platform
export async function shareToSocial(tipData, platform = 'twitter') {
  const receipt = generateTipReceipt(tipData);
  const text = generateTipShareText(receipt, platform);
  
  if (platform === 'discord') {
    await navigator.clipboard.writeText(text);
    return { copied: true, text };
  }
  
  const url = getShareUrl(text, platform);
  if (url) window.open(url, '_blank', 'width=600,height=400');
  return { url, text };
}

// Generate creator tip page deep link
export function generateCreatorLink(creatorAddress, prefilledAmount = null) {
  const base = `https://tipjar.app/tip/${creatorAddress}`;
  if (prefilledAmount) {
    return `${base}?amount=${prefilledAmount}`;
  }
  return base;
}

// Generate badge achievement share text
export function generateBadgeShareText(badgeName, badgeEmoji = '🏅') {
  return `${badgeEmoji} Just earned the "${badgeName}" badge on ${APP_NAME}!\n\nBuilding my reputation on the Stacks blockchain 💎\n\nhttps://tipjar.app/badges`;
}

// Copy text to clipboard with fallback
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}
