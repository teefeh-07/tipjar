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

