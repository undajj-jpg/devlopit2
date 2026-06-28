import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

export const wizardRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(30, "10 m"),
  analytics: true,
  prefix: "ratelimit:wizard",
});

export const estimateRateLimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(20, "10 m"),
  analytics: true,
  prefix: "ratelimit:estimate",
});
