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

// Token bucket implementation
class TokenBucket {
  constructor(maxTokens, refillRate, refillInterval) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
    this.refillInterval = refillInterval;
  }
  
  refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillInterval) * this.refillRate;
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  tryConsume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
  
  getRetryAfter() {
    return Math.ceil((1 - this.tokens) * this.refillInterval / this.refillRate);
  }
}

// Sliding window counter
class SlidingWindowCounter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  cleanup() {
    const cutoff = Date.now() - this.windowMs;
    this.requests = this.requests.filter(t => t > cutoff);
  }
  
  tryRequest() {
    this.cleanup();
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    this.requests.push(Date.now());
    return true;
  }
  
  remaining() {
    this.cleanup();
    return Math.max(0, this.maxRequests - this.requests.length);
  }
  
  retryAfter() {
    this.cleanup();
    if (this.requests.length === 0) return 0;
    return Math.max(0, this.requests[0] + this.windowMs - Date.now());
  }
}

