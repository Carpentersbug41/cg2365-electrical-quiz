/**
 * Client-Side Throttle Service
 * Provides client-side rate limiting as a backstop for serverless rate limiting
 * Prevents rapid-fire requests and provides better UX
 */

/**
 * Throttle configuration per endpoint
 */
interface ThrottleConfig {
  minInterval: number; // Minimum milliseconds between requests
  maxBurstRequests: number; // Max requests in burst window
  burstWindow: number; // Burst window in milliseconds
}

/**
 * Default throttle configurations by endpoint
 */
const DEFAULT_THROTTLE_CONFIGS: Record<string, ThrottleConfig> = {
  '/api/tutor': {
    minInterval: 1000, // 1 second between tutor requests
    maxBurstRequests: 3, // Max 3 requests in 10 seconds
    burstWindow: 10000,
  },
  '/api/marking': {
    minInterval: 500, // 0.5 seconds between marking requests
    maxBurstRequests: 5, // Max 5 requests in 10 seconds
    burstWindow: 10000,
  },
  '/api/questions/variant': {
    minInterval: 200, // 0.2 seconds between variant requests
    maxBurstRequests: 10, // Max 10 requests in 10 seconds
    burstWindow: 10000,
  },
};

/**
 * Request history entry
 */
interface RequestHistory {
  timestamp: number;
  endpoint: string;
}

/**
 * Client Throttle Manager
 */
class ClientThrottleManager {
  private requestHistory: RequestHistory[] = [];
  private lastRequestTimes: Map<string, number> = new Map();
  private maxHistorySize = 100;

  /**
   * Check if a request should be allowed
   */
  canMakeRequest(endpoint: string): {
    allowed: boolean;
    reason?: string;
    retryAfter?: number; // milliseconds
  } {
    const config = this.getConfig(endpoint);
    const now = Date.now();

    // Check minimum interval
    const lastRequestTime = this.lastRequestTimes.get(endpoint);
    if (lastRequestTime) {
      const timeSinceLastRequest = now - lastRequestTime;
      if (timeSinceLastRequest < config.minInterval) {
        return {
          allowed: false,
          reason: 'min-interval',
          retryAfter: config.minInterval - timeSinceLastRequest,
        };
      }
    }

    // Check burst limit
    const recentRequests = this.requestHistory.filter(
      req => req.endpoint === endpoint && now - req.timestamp < config.burstWindow
    );

    if (recentRequests.length >= config.maxBurstRequests) {
      const oldestRequest = recentRequests[0];
      const retryAfter = config.burstWindow - (now - oldestRequest.timestamp);
      return {
        allowed: false,
        reason: 'burst-limit',
        retryAfter,
      };
    }

    return { allowed: true };
  }

  /**
   * Record a request
   */
  recordRequest(endpoint: string): void {
    const now = Date.now();
    
    // Record in history
    this.requestHistory.push({
      timestamp: now,
      endpoint,
    });

    // Update last request time
    this.lastRequestTimes.set(endpoint, now);

    // Cleanup old history
    this.cleanupHistory();
  }

  /**
   * Get configuration for endpoint
   */
  private getConfig(endpoint: string): ThrottleConfig {
    return DEFAULT_THROTTLE_CONFIGS[endpoint] || {
      minInterval: 1000,
      maxBurstRequests: 5,
      burstWindow: 10000,
    };
  }

  /**
   * Cleanup old history entries
   */
  private cleanupHistory(): void {
    const now = Date.now();
    const maxWindow = Math.max(
      ...Object.values(DEFAULT_THROTTLE_CONFIGS).map(c => c.burstWindow)
    );

    // Remove entries older than max window
    this.requestHistory = this.requestHistory.filter(
      req => now - req.timestamp < maxWindow * 2
    );

    // Limit total history size
    if (this.requestHistory.length > this.maxHistorySize) {
      this.requestHistory = this.requestHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get throttle status for debugging
   */
  getStatus(endpoint: string): {
    lastRequestTime?: number;
    recentRequestCount: number;
    nextAvailableTime: number;
  } {
    const config = this.getConfig(endpoint);
    const now = Date.now();
    const lastRequestTime = this.lastRequestTimes.get(endpoint);

    const recentRequests = this.requestHistory.filter(
      req => req.endpoint === endpoint && now - req.timestamp < config.burstWindow
    );

    let nextAvailableTime = now;
    if (lastRequestTime && now - lastRequestTime < config.minInterval) {
      nextAvailableTime = lastRequestTime + config.minInterval;
    }

    return {
      lastRequestTime,
      recentRequestCount: recentRequests.length,
      nextAvailableTime,
    };
  }

  /**
   * Reset throttle for an endpoint (for testing)
   */
  reset(endpoint?: string): void {
    if (endpoint) {
      this.lastRequestTimes.delete(endpoint);
      this.requestHistory = this.requestHistory.filter(req => req.endpoint !== endpoint);
    } else {
      this.lastRequestTimes.clear();
      this.requestHistory = [];
    }
  }
}

// Global instance
const throttleManager = new ClientThrottleManager();

/**
 * Check if request can be made
 */
export function canMakeRequest(endpoint: string): {
  allowed: boolean;
  reason?: string;
  retryAfter?: number;
} {
  return throttleManager.canMakeRequest(endpoint);
}

/**
 * Record a request
 */
export function recordRequest(endpoint: string): void {
  throttleManager.recordRequest(endpoint);
}

/**
 * Get throttle status
 */
export function getThrottleStatus(endpoint: string) {
  return throttleManager.getStatus(endpoint);
}

/**
 * Reset throttle
 */
export function resetThrottle(endpoint?: string): void {
  throttleManager.reset(endpoint);
}

/**
 * Throttled fetch wrapper
 * Automatically enforces client-side throttling
 */
export async function throttledFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const check = canMakeRequest(endpoint);

  if (!check.allowed) {
    console.warn(`Client throttle: ${endpoint} blocked (${check.reason})`);
    
    // Wait for retry time
    if (check.retryAfter && check.retryAfter < 5000) {
      console.log(`Waiting ${check.retryAfter}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, check.retryAfter));
    } else {
      throw new Error(
        `Too many requests. Please wait ${Math.ceil((check.retryAfter || 0) / 1000)} seconds.`
      );
    }
  }

  // Record request
  recordRequest(endpoint);

  // Make actual request
  return fetch(endpoint, options);
}


