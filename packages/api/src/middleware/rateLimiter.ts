import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// General rate limiting
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:general:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Progressive delay for repeated requests
export const speedLimiter = slowDown({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:speed:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 10, // allow 10 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 10
  maxDelayMs: 20000, // max delay of 20 seconds
});

// User-specific rate limiting
export const userRateLimiter = (userId: string) => rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: `rl:user:${userId}:`,
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // limit each user to 1000 requests per hour
  message: {
    error: 'Rate limit exceeded for this user account.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API key rate limiting
export const apiKeyLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:apikey:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10000, // limit each API key to 10000 requests per hour
  message: {
    error: 'API key rate limit exceeded.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-api-key'] as string || req.ip,
});

export default {
  generalLimiter,
  authLimiter,
  speedLimiter,
  userRateLimiter,
  apiKeyLimiter,
};
