// Analytics and Metrics Tracking Service
// Tracks user engagement, tipping patterns, and platform health

import { API_URL } from '../config/network.js';

// Event types for analytics tracking
export const ANALYTICS_EVENTS = {
  // User lifecycle events
  WALLET_CONNECTED: 'wallet_connected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
  SESSION_STARTED: 'session_started',
  SESSION_ENDED: 'session_ended',
  
  // Tipping events
  TIP_INITIATED: 'tip_initiated',
  TIP_CONFIRMED: 'tip_confirmed',
  TIP_FAILED: 'tip_failed',
  TIP_AMOUNT_CHANGED: 'tip_amount_changed',
  
  // Engagement events
  PAGE_VIEWED: 'page_viewed',
  FEATURE_USED: 'feature_used',
  CREATOR_VIEWED: 'creator_viewed',
  LEADERBOARD_VIEWED: 'leaderboard_viewed',
  
  // Subscription events
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  
  // Badge events
  BADGE_EARNED: 'badge_earned',
  BADGE_VIEWED: 'badge_viewed',
};

// Analytics state
let eventQueue = [];
let sessionId = null;
let sessionStartTime = null;
let metricsCache = {};
const BATCH_SIZE = 25;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Generate session ID
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// Start a new analytics session
export function startSession() {
  sessionId = generateSessionId();
  sessionStartTime = Date.now();
  trackEvent(ANALYTICS_EVENTS.SESSION_STARTED, {
    sessionId,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  });
  return sessionId;
}

// End current session
export function endSession() {
  if (!sessionId) return;
  const duration = Date.now() - sessionStartTime;
  trackEvent(ANALYTICS_EVENTS.SESSION_ENDED, {
    sessionId,
    duration,
    timestamp: new Date().toISOString(),
  });
  flushEvents();
  sessionId = null;
  sessionStartTime = null;
}

