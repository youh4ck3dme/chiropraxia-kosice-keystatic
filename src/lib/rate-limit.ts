// Rate limiting middleware for API routes
// Uses in-memory store (for dev/edge) - replace with Upstash Redis for production

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
};

export function rateLimit(
  clientId: string,
  config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = clientId;

  let entry = rateLimitStore.get(key);

  // Clean up expired entries
  if (entry && entry.resetAt < now) {
    rateLimitStore.delete(key);
    entry = undefined;
  }

  if (!entry) {
    // First request in this window
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Check if over limit
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  // Increment counter
  entry.count++;

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetAt - now,
  };
}

// Specific rate limit configs for different routes
export const rateLimitConfigs = {
  chat: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 AI chat requests per minute
  },
  booking: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 booking attempts per minute
  },
  email: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3, // 3 emails per minute
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 general API calls per minute
  },
};

// Helper to get client IP (for use in API routes)
export function getClientId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip.trim();
}

// Response helper for rate limit exceeded
export function rateLimitResponse(resetIn: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil(resetIn / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(resetIn / 1000)),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}
