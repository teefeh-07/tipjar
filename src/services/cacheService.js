// Intelligent Caching Service
// LRU cache with TTL, stale-while-revalidate, and selective invalidation

// Cache configuration
const DEFAULT_TTL = 60000; // 1 minute
const MAX_ENTRIES = 500;
const SWEEP_INTERVAL = 120000; // 2 minutes

// Cache storage
const cache = new Map();
const accessOrder = [];

