import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _wizardRateLimit: Ratelimit | null = null;
let _estimateRateLimit: Ratelimit | null = null;

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export function getWizardRateLimit() {
  if (!_wizardRateLimit) {
    _wizardRateLimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(30, "10 m"),
      analytics: true,
      prefix: "ratelimit:wizard",
    });
  }
  return _wizardRateLimit;
}

export function getEstimateRateLimit() {
  if (!_estimateRateLimit) {
    _estimateRateLimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(20, "10 m"),
      analytics: true,
      prefix: "ratelimit:estimate",
    });
  }
  return _estimateRateLimit;
}
