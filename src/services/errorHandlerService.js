// Centralized Error Handling and Reporting Service
// Captures, categorizes, and provides recovery for application errors

// Error categories
export const ERROR_CATEGORIES = {
  NETWORK: 'network',
  BLOCKCHAIN: 'blockchain',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  RATE_LIMIT: 'rate_limit',
  APPLICATION: 'application',
  UNKNOWN: 'unknown',
};

// User-friendly error messages
const ERROR_MESSAGES = {
  [ERROR_CATEGORIES.NETWORK]: 'Network connection issue. Please check your internet connection and try again.',
  [ERROR_CATEGORIES.BLOCKCHAIN]: 'Blockchain transaction failed. The network may be congested.',
  [ERROR_CATEGORIES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_CATEGORIES.AUTHENTICATION]: 'Authentication required. Please connect your wallet.',
  [ERROR_CATEGORIES.RATE_LIMIT]: 'Too many requests. Please wait a moment before trying again.',
  [ERROR_CATEGORIES.APPLICATION]: 'An unexpected error occurred. Please try again.',
  [ERROR_CATEGORIES.UNKNOWN]: 'Something went wrong. Please try again later.',
};

// Error log storage
const errorLog = [];
const MAX_ERROR_LOG = 200;

// Classify error by examining message and properties
export function classifyError(error) {
  const message = (error.message || '').toLowerCase();
  
  if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
    return ERROR_CATEGORIES.NETWORK;
  }
  if (message.includes('broadcast') || message.includes('transaction') || message.includes('contract')) {
    return ERROR_CATEGORIES.BLOCKCHAIN;
  }
  if (message.includes('invalid') || message.includes('required') || message.includes('validation')) {
    return ERROR_CATEGORIES.VALIDATION;
  }
  if (message.includes('auth') || message.includes('wallet') || message.includes('connect')) {
    return ERROR_CATEGORIES.AUTHENTICATION;
  }
  if (message.includes('rate') || message.includes('limit') || message.includes('throttle')) {
    return ERROR_CATEGORIES.RATE_LIMIT;
  }
  
  return ERROR_CATEGORIES.UNKNOWN;
}

// Handle an error with categorization and logging
export function handleError(error, context = '') {
  const category = classifyError(error);
  const userMessage = ERROR_MESSAGES[category];
  
  const entry = {
    timestamp: Date.now(),
    category,
    message: error.message,
    stack: error.stack,
    context,
    userMessage,
  };
  
  // Add to log (circular buffer)
  errorLog.push(entry);
  if (errorLog.length > MAX_ERROR_LOG) errorLog.shift();
  
  // Log to console with category color
  console.error(`[${category.toUpperCase()}] ${context}: ${error.message}`);
  
  return { category, userMessage, originalError: error };
}

// Circuit breaker implementation
const circuitBreakers = new Map();

export function createCircuitBreaker(name, options = {}) {
  const {
    failureThreshold = 5,
    resetTimeout = 60000,
    halfOpenRequests = 1,
  } = options;
  
  const breaker = {
    name,
    state: 'closed', // closed, open, half-open
    failures: 0,
    lastFailure: null,
    failureThreshold,
    resetTimeout,
    halfOpenRequests,
    successCount: 0,
  };
  
  circuitBreakers.set(name, breaker);
  return breaker;
}

export function isCircuitOpen(name) {
  const breaker = circuitBreakers.get(name);
  if (!breaker) return false;
  
  if (breaker.state === 'open') {
    if (Date.now() - breaker.lastFailure > breaker.resetTimeout) {
      breaker.state = 'half-open';
      return false;
    }
    return true;
  }
  return false;
}

export function recordSuccess(name) {
  const breaker = circuitBreakers.get(name);
  if (breaker) {
    breaker.failures = 0;
    breaker.state = 'closed';
  }
}

export function recordFailure(name) {
  const breaker = circuitBreakers.get(name);
  if (breaker) {
    breaker.failures++;
    breaker.lastFailure = Date.now();
    if (breaker.failures >= breaker.failureThreshold) {
      breaker.state = 'open';
    }
  }
}

