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

