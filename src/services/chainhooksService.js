// Chainhooks integration service
// Real-time on-chain event monitoring via @hirosystems/chainhooks-client

import Chainhook from '@hirosystems/chainhooks-client';

const CHAINHOOKS_API_KEY = process.env.CHAINHOOKS_API_KEY || '';
const WEBHOOK_URL = process.env.CHAINHOOKS_WEBHOOK_URL || 'http://localhost:3001/webhooks';

let chainhooksClient = null;

export async function initChainhooks() {
  chainhooksClient = new Chainhook({
    apiKey: CHAINHOOKS_API_KEY,
  });
  console.log('Chainhooks client initialized');
  return chainhooksClient;
}

