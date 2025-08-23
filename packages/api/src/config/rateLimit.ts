/**
 * Centralized rate limiting configuration
 * This file contains all rate limiting rules and configurations
 */

export interface RateLimitConfig {
  // General API limits
  general: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
  };
  
  // Authentication endpoints
  auth: {
    login: {
      windowMs: number;
      maxAttempts: number;
      blockDuration: number;
      skipSuccessfulRequests: boolean;
    };
    register: {
      windowMs: number;
      maxAttempts: number;
      skipSuccessfulRequests: boolean;
    };
    passwordReset: {
      windowMs: number;
      maxAttempts: number;
      skipSuccessfulRequests: boolean;
    };
  };
  
  // User-specific limits
  user: {
    loginAttempts: {
      windowMs: number;
      maxAttempts: number;
      lockoutDuration: number;
    };
    passwordAttempts: {
      windowMs: number;
      maxAttempts: number;
      lockoutDuration: number;
    };
  };
  
  // IP-based limits
  ip: {
    loginAttempts: {
      windowMs: number;
      maxAttempts: number;
      blockDuration: number;
    };
    apiRequests: {
      windowMs: number;
      maxRequests: number;
    };
  };
  
  // API key limits
  apiKey: {
    windowMs: number;
    maxRequests: number;
  };
}

export const rateLimitConfig: RateLimitConfig = {
  // General API rate limiting
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
  
  // Authentication-specific limits
  auth: {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5,
      blockDuration: 30 * 60 * 1000, // 30 minutes
      skipSuccessfulRequests: true,
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxAttempts: 3,
      skipSuccessfulRequests: true,
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxAttempts: 3,
      skipSuccessfulRequests: true,
    },
  },
  
  // User-specific limits
  user: {
    loginAttempts: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5,
      lockoutDuration: 30 * 60 * 1000, // 30 minutes
    },
    passwordAttempts: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 3,
      lockoutDuration: 60 * 60 * 1000, // 1 hour
    },
  },
  
  // IP-based limits
  ip: {
    loginAttempts: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 10,
      blockDuration: 60 * 60 * 1000, // 1 hour
    },
    apiRequests: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 200,
    },
  },
  
  // API key limits
  apiKey: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
  },
};

// Redis key prefixes for rate limiting
export const RATE_LIMIT_PREFIXES = {
  LOGIN_ATTEMPTS: 'rl:login:',
  REGISTER_ATTEMPTS: 'rl:register:',
  PASSWORD_RESET_ATTEMPTS: 'rl:pwdreset:',
  IP_REQUESTS: 'rl:ip:',
  USER_REQUESTS: 'rl:user:',
  API_KEY_REQUESTS: 'rl:apikey:',
} as const;

// Error messages
export const RATE_LIMIT_MESSAGES = {
  TOO_MANY_LOGIN_ATTEMPTS: 'Too many login attempts. Please try again later.',
  TOO_MANY_REGISTER_ATTEMPTS: 'Too many registration attempts. Please try again later.',
  TOO_MANY_PASSWORD_RESETS: 'Too many password reset attempts. Please try again later.',
  TOO_MANY_REQUESTS: 'Too many requests. Please slow down.',
  ACCOUNT_LOCKED: 'Account temporarily locked due to suspicious activity.',
} as const;
