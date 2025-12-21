// lib/data/analytics.ts

import fs from "fs/promises";
import path from "path";

const ANALYTICS_PATH = path.join(process.cwd(), "data", "analytics.json");
const REDIS_ANALYTICS_KEY = "savanablu:analytics";

// Lazy load Redis client (only when needed)
let redisClient: any = null;
async function getRedis(): Promise<any> {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    const Redis = (await import("ioredis")).default;
    redisClient = new Redis(process.env.REDIS_URL);
    
    redisClient.on("error", (err: any) => {
      console.warn("[Analytics] Redis connection error:", err.message);
      redisClient = null;
    });

    return redisClient;
  } catch (err: any) {
    console.warn("[Analytics] Redis not available:", err.message);
    return null;
  }
}

export type VisitRecord = {
  id: string;
  slug: string;
  type: "safari" | "tour";
  timestamp: string;
  country?: string;
  city?: string;
  device?: "desktop" | "mobile" | "tablet";
  browser?: string;
  referrer?: string;
  referrerType?: "direct" | "search" | "social" | "other";
  userAgent?: string;
};

export type AnalyticsData = {
  visits: VisitRecord[];
  lastUpdated: string;
};

/**
 * Read analytics from Redis (if available) or fallback to file system
 */
async function readAnalyticsFromStorage(): Promise<AnalyticsData> {
  const defaultData: AnalyticsData = {
    visits: [],
    lastUpdated: new Date().toISOString(),
  };

  const redis = await getRedis();
  if (redis) {
    try {
      const data = await redis.get(REDIS_ANALYTICS_KEY);
      if (data) {
        const parsed = JSON.parse(data) as AnalyticsData;
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.visits)) {
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn("[Analytics] Error reading from Redis:", err.message);
    }
  }

  try {
    const raw = await fs.readFile(ANALYTICS_PATH, "utf-8");
    const data = JSON.parse(raw) as AnalyticsData;
    if (data && typeof data === "object" && Array.isArray(data.visits)) {
      return data;
    }
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.warn("[Analytics] Error reading from file system:", err.message);
    }
  }

  return defaultData;
}

/**
 * Write analytics to Redis (if available) and/or file system
 */
async function writeAnalyticsToStorage(data: AnalyticsData): Promise<void> {
  let redisSuccess = false;
  let fileSuccess = false;

  const redis = await getRedis();
  if (redis) {
    try {
      // Limit to last 10,000 visits to prevent storage bloat
      const limitedData = {
        ...data,
        visits: data.visits.slice(-10000),
      };
      await redis.set(REDIS_ANALYTICS_KEY, JSON.stringify(limitedData));
      redisSuccess = true;
    } catch (err: any) {
      console.warn("[Analytics] Error writing to Redis:", err.message);
    }
  }

  try {
    await fs.mkdir(path.dirname(ANALYTICS_PATH), { recursive: true });
    // Limit to last 10,000 visits
    const limitedData = {
      ...data,
      visits: data.visits.slice(-10000),
    };
    await fs.writeFile(ANALYTICS_PATH, JSON.stringify(limitedData, null, 2), "utf-8");
    fileSuccess = true;
  } catch (err: any) {
    console.warn("[Analytics] Error writing to file system:", err.message);
  }

  if (!redisSuccess && !fileSuccess) {
    throw new Error("Failed to save analytics to both Redis and file system");
  }
}

/**
 * Add a visit record
 */
export async function addVisitRecord(visit: Omit<VisitRecord, "id" | "timestamp">): Promise<void> {
  const data = await readAnalyticsFromStorage();
  const now = new Date().toISOString();

  const record: VisitRecord = {
    ...visit,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: now,
  };

  data.visits.push(record);
  data.lastUpdated = now;

  await writeAnalyticsToStorage(data);
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary() {
  const data = await readAnalyticsFromStorage();
  const visits = data.visits;

  // Geographic breakdown
  const byCountry: Record<string, number> = {};
  const byCity: Record<string, number> = {};
  visits.forEach((v) => {
    if (v.country) {
      byCountry[v.country] = (byCountry[v.country] || 0) + 1;
    }
    if (v.city) {
      const key = `${v.city}, ${v.country || "Unknown"}`;
      byCity[key] = (byCity[key] || 0) + 1;
    }
  });

  // Device breakdown
  const byDevice: Record<string, number> = {};
  visits.forEach((v) => {
    const device = v.device || "unknown";
    byDevice[device] = (byDevice[device] || 0) + 1;
  });

  // Browser breakdown
  const byBrowser: Record<string, number> = {};
  visits.forEach((v) => {
    const browser = v.browser || "unknown";
    byBrowser[browser] = (byBrowser[browser] || 0) + 1;
  });

  // Referrer breakdown
  const byReferrer: Record<string, number> = {};
  visits.forEach((v) => {
    const referrer = v.referrerType || "direct";
    byReferrer[referrer] = (byReferrer[referrer] || 0) + 1;
  });

  // Time patterns (hourly)
  const byHour: Record<number, number> = {};
  visits.forEach((v) => {
    const hour = new Date(v.timestamp).getHours();
    byHour[hour] = (byHour[hour] || 0) + 1;
  });

  // Time patterns (day of week)
  const byDayOfWeek: Record<string, number> = {};
  visits.forEach((v) => {
    const day = new Date(v.timestamp).toLocaleDateString("en-US", { weekday: "long" });
    byDayOfWeek[day] = (byDayOfWeek[day] || 0) + 1;
  });

  // Top pages
  const byPage: Record<string, number> = {};
  visits.forEach((v) => {
    const key = `${v.type}:${v.slug}`;
    byPage[key] = (byPage[key] || 0) + 1;
  });

  const topPages = Object.entries(byPage)
    .map(([key, count]) => {
      const [type, slug] = key.split(":");
      return { type, slug, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total: visits.length,
    byCountry: Object.entries(byCountry)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count),
    byCity: Object.entries(byCity)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    byDevice: Object.entries(byDevice).map(([device, count]) => ({ device, count })),
    byBrowser: Object.entries(byBrowser)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    byReferrer: Object.entries(byReferrer).map(([referrer, count]) => ({ referrer, count })),
    byHour: Object.entries(byHour)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour),
    byDayOfWeek: Object.entries(byDayOfWeek).map(([day, count]) => ({ day, count })),
    topPages,
  };
}

/**
 * Get recent visits
 */
export async function getRecentVisits(limit: number = 50): Promise<VisitRecord[]> {
  const data = await readAnalyticsFromStorage();
  return data.visits
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

