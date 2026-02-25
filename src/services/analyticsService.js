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

// Track an analytics event
export function trackEvent(eventType, data = {}) {
  const event = {
    type: eventType,
    sessionId,
    timestamp: Date.now(),
    data,
  };
  eventQueue.push(event);
  
  // Auto-flush when batch size reached
  if (eventQueue.length >= BATCH_SIZE) {
    flushEvents();
  }
}

// Track page view
export function trackPageView(pageName) {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEWED, { page: pageName });
}

// Track feature usage
export function trackFeatureUsage(featureName, metadata = {}) {
  trackEvent(ANALYTICS_EVENTS.FEATURE_USED, { feature: featureName, ...metadata });
}

// Flush events to storage/API
export function flushEvents() {
  if (eventQueue.length === 0) return;
  
  const eventsToSend = [...eventQueue];
  eventQueue = [];
  
  // Store in localStorage for offline access
  try {
    const stored = JSON.parse(localStorage.getItem('tipjar_analytics') || '[]');
    const combined = [...stored, ...eventsToSend].slice(-1000); // Keep last 1000
    localStorage.setItem('tipjar_analytics', JSON.stringify(combined));
  } catch (err) {
    console.warn('Analytics flush failed:', err.message);
  }
  
  return eventsToSend;
}

