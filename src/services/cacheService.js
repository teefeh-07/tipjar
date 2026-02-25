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

// Get value from cache
export function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (isExpired(entry)) {
    cache.delete(key);
    return null;
  }
  
  entry.lastAccessed = Date.now();
  entry.hitCount++;
  
  // Move to end of access order (LRU)
  const idx = accessOrder.indexOf(key);
  if (idx > -1) accessOrder.splice(idx, 1);
  accessOrder.push(key);
  
  return entry.value;
}

// Set value in cache
export function cacheSet(key, value, ttl = DEFAULT_TTL) {
  // Evict LRU entries if at capacity
  while (cache.size >= MAX_ENTRIES && accessOrder.length > 0) {
    const evictKey = accessOrder.shift();
    cache.delete(evictKey);
  }
  
  cache.set(key, createEntry(key, value, ttl));
  accessOrder.push(key);
}

