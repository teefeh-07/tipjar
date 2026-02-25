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

// Cached fetch with stale-while-revalidate
export async function cachedFetch(key, fetchFn, options = {}) {
  const { ttl = DEFAULT_TTL, staleWhileRevalidate = 30000 } = options;
  
  // Check cache first
  const entry = cache.get(key);
  
  if (entry && !isExpired(entry)) {
    entry.lastAccessed = Date.now();
    entry.hitCount++;
    return entry.value;
  }
  
  // Serve stale if within revalidation window
  if (entry && isStale(entry, staleWhileRevalidate)) {
    // Return stale data immediately, refresh in background
    fetchFn().then(freshValue => {
      cacheSet(key, freshValue, ttl);
    }).catch(err => {
      console.warn(`Background revalidation failed for ${key}:`, err.message);
    });
    return entry.value;
  }
  
  // Cache miss: fetch fresh data
  const value = await fetchFn();
  cacheSet(key, value, ttl);
  return value;
}

// Invalidate cache entries by pattern
export function invalidatePattern(pattern) {
  const regex = new RegExp(pattern);
  let invalidated = 0;
  
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
      const idx = accessOrder.indexOf(key);
      if (idx > -1) accessOrder.splice(idx, 1);
      invalidated++;
    }
  }
  
  return invalidated;
}

// Clear all cache
export function clearCache() {
  cache.clear();
  accessOrder.length = 0;
}

// Get cache statistics
export function getCacheStats() {
  let totalHits = 0;
  let expired = 0;
  
  for (const entry of cache.values()) {
    totalHits += entry.hitCount;
    if (isExpired(entry)) expired++;
  }
  
  return {
    entries: cache.size,
    maxEntries: MAX_ENTRIES,
    totalHits,
    expiredEntries: expired,
    memoryEstimate: `${(cache.size * 0.5).toFixed(1)}KB`,
  };
}

// Periodic cleanup sweep
function sweepExpired() {
  let swept = 0;
  for (const [key, entry] of cache.entries()) {
    if (isExpired(entry)) {
      cache.delete(key);
      const idx = accessOrder.indexOf(key);
      if (idx > -1) accessOrder.splice(idx, 1);
      swept++;
    }
  }
  if (swept > 0) console.debug(`Cache sweep: removed ${swept} expired entries`);
}

// Cache warming for common data
export async function warmCache(warmingFns = []) {
  console.debug('Warming cache...');
  const results = await Promise.allSettled(
    warmingFns.map(async ({ key, fn, ttl }) => {
      const value = await fn();
      cacheSet(key, value, ttl || DEFAULT_TTL * 5);
      return key;
    })
  );
  const success = results.filter(r => r.status === 'fulfilled').length;
  console.debug(`Cache warmed: ${success}/${warmingFns.length} entries`);
}

// Initialize cache service
export function initCache() {
  setInterval(sweepExpired, SWEEP_INTERVAL);
}
