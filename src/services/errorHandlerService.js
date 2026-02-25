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

