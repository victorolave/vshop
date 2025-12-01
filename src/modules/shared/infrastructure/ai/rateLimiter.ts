interface RateLimiterConfig {
  maxRequests?: number;
  windowMs?: number;
}

interface RequestRecord {
  timestamps: number[];
}

/** In-memory sliding window rate limiter */
export class RateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly requests: Map<string, RequestRecord>;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config?: RateLimiterConfig) {
    this.maxRequests = config?.maxRequests ?? 10;
    this.windowMs = config?.windowMs ?? 60000;
    this.requests = new Map();
    this.startCleanup();
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.requests.get(identifier);
    if (!record) {
      record = { timestamps: [] };
      this.requests.set(identifier, record);
    }

    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      console.warn(`[RateLimiter] Rate limit exceeded for ${identifier}`);
      return false;
    }

    record.timestamps.push(now);
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const windowStart = Date.now() - this.windowMs;
    const record = this.requests.get(identifier);
    if (!record) return this.maxRequests;
    const count = record.timestamps.filter((ts) => ts > windowStart).length;
    return Math.max(0, this.maxRequests - count);
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  resetAll(): void {
    this.requests.clear();
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    if (this.cleanupInterval.unref) this.cleanupInterval.unref();
  }

  private cleanup(): void {
    const windowStart = Date.now() - this.windowMs;
    for (const [id, record] of this.requests.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) this.requests.delete(id);
    }
  }

  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

let globalRateLimiter: RateLimiter | null = null;

export function getGlobalRateLimiter(): RateLimiter {
  if (!globalRateLimiter) {
    globalRateLimiter = new RateLimiter({
      maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    });
  }
  return globalRateLimiter;
}

export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;

  const cfIP = request.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  return "unknown";
}
