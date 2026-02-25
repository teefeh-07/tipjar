// Client-side Rate Limiter Service
// Prevents API abuse with token bucket and sliding window algorithms

// Rate limit configurations
const RATE_LIMITS = {
  // Transaction operations (strict)
  'tip:send': { maxRequests: 10, windowMs: 60000, burstCapacity: 3 },
  'tip:subscribe': { maxRequests: 5, windowMs: 60000, burstCapacity: 2 },
  'escrow:create': { maxRequests: 5, windowMs: 60000, burstCapacity: 1 },
  
  // Read operations (relaxed)
  'read:balance': { maxRequests: 30, windowMs: 60000, burstCapacity: 10 },
  'read:history': { maxRequests: 20, windowMs: 60000, burstCapacity: 5 },
  'read:stats': { maxRequests: 60, windowMs: 60000, burstCapacity: 15 },
  
  // Default
  default: { maxRequests: 30, windowMs: 60000, burstCapacity: 10 },
};

