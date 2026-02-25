// Intelligent Caching Service
// LRU cache with TTL, stale-while-revalidate, and selective invalidation

// Cache configuration
const DEFAULT_TTL = 60000; // 1 minute
const MAX_ENTRIES = 500;
const SWEEP_INTERVAL = 120000; // 2 minutes

// Cache storage
const cache = new Map();
const accessOrder = [];

// Cache entry structure
function createEntry(key, value, ttl = DEFAULT_TTL) {
  return {
    key,
    value,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttl,
    lastAccessed: Date.now(),
    hitCount: 0,
  };
}

// Check if entry is expired
function isExpired(entry) {
  return Date.now() > entry.expiresAt;
}

// Check if entry is stale but usable
function isStale(entry, staleThreshold = 0) {
  return Date.now() > entry.expiresAt && Date.now() < entry.expiresAt + staleThreshold;
}

