/**
 * Rate Limiter for Lesson Generation
 * Prevents abuse and manages API quotas
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry>;
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60 * 60 * 1000) {
    this.limits = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // No entry or window expired
    if (!entry || now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });

      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }

    // Within window
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.limits.set(identifier, entry);

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Get identifier from request (IP or user ID)
   */
  getIdentifier(request: Request): string {
    // Try to get IP from headers
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return realIp;
    }

    // Fallback to generic identifier
    return 'default';
  }

  /**
   * Reset limits for identifier
   */
  resetLimit(identifier: string): void {
    this.limits.delete(identifier);
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(identifier);
      }
    }
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter(5, 60 * 60 * 1000); // 5 requests per hour

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    globalRateLimiter.cleanup();
  }, 10 * 60 * 1000);
}
