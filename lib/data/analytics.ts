// lib/data/analytics.ts

import fs from "fs/promises";
import path from "path";

const ANALYTICS_PATH = path.join(process.cwd(), "data", "analytics.json");
const REDIS_ANALYTICS_KEY = "savanablu:analytics";

/**
 * Get list of excluded IP addresses (from environment variable)
 * Format: comma-separated list of IPs, e.g., "1.2.3.4,5.6.7.8"
 */
function getExcludedIPs(): string[] {
  const excluded = process.env.EXCLUDED_ANALYTICS_IPS || "";
  if (!excluded.trim()) {
    return [];
  }
  return excluded.split(",").map((ip) => ip.trim()).filter((ip) => ip.length > 0);
}

/**
 * Check if an IP address should be excluded from analytics
 */
function isIPExcluded(ip?: string): boolean {
  if (!ip) {
    return false;
  }
  const excludedIPs = getExcludedIPs();
  return excludedIPs.includes(ip);
}

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
  ipAddress?: string; // IP address for unique visit tracking
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
 * Add a visit record (only if IP is not excluded)
 */
export async function addVisitRecord(visit: Omit<VisitRecord, "id" | "timestamp">): Promise<void> {
  // Skip if IP is excluded
  if (isIPExcluded(visit.ipAddress)) {
    console.log(`[Analytics] Skipping visit from excluded IP: ${visit.ipAddress}`);
    return;
  }

  const data = await readAnalyticsFromStorage();
  const now = new Date().toISOString();

  // Check for duplicate visit: same IP + slug + date (to count unique visits per day)
  const visitDate = new Date(now).toISOString().split("T")[0]; // YYYY-MM-DD
  const isDuplicate = data.visits.some((v) => {
    if (!v.ipAddress || !visit.ipAddress) {
      return false; // If no IP, allow tracking (backward compatibility)
    }
    const vDate = new Date(v.timestamp).toISOString().split("T")[0];
    return (
      v.ipAddress === visit.ipAddress &&
      v.slug === visit.slug &&
      v.type === visit.type &&
      vDate === visitDate
    );
  });

  // Skip duplicate visits (same IP visiting same page on same day)
  if (isDuplicate) {
    console.log(`[Analytics] Skipping duplicate visit: ${visit.ipAddress} -> ${visit.slug} on ${visitDate}`);
    return;
  }

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
 * Get analytics summary (excluding filtered IPs and counting unique visits)
 */
export async function getAnalyticsSummary() {
  const data = await readAnalyticsFromStorage();
  
  // Filter out excluded IPs
  const visits = data.visits.filter((v) => !isIPExcluded(v.ipAddress));
  
  // Count unique visits: same IP + slug combination counts as 1
  const uniqueVisits = new Set<string>();
  visits.forEach((v) => {
    if (v.ipAddress) {
      uniqueVisits.add(`${v.ipAddress}:${v.type}:${v.slug}`);
    }
  });

  // Geographic breakdown (count unique IPs per country/city)
  const byCountry: Record<string, Set<string>> = {};
  const byCity: Record<string, Set<string>> = {};
  visits.forEach((v) => {
    if (v.ipAddress) {
      if (v.country) {
        if (!byCountry[v.country]) {
          byCountry[v.country] = new Set();
        }
        byCountry[v.country].add(v.ipAddress);
      }
      if (v.city) {
        const key = `${v.city}, ${v.country || "Unknown"}`;
        if (!byCity[key]) {
          byCity[key] = new Set();
        }
        byCity[key].add(v.ipAddress);
      }
    }
  });

  // Device breakdown (count unique IPs per device)
  const byDevice: Record<string, Set<string>> = {};
  visits.forEach((v) => {
    if (v.ipAddress) {
      const device = v.device || "unknown";
      if (!byDevice[device]) {
        byDevice[device] = new Set();
      }
      byDevice[device].add(v.ipAddress);
    }
  });

  // Browser breakdown (count unique IPs per browser)
  const byBrowser: Record<string, Set<string>> = {};
  visits.forEach((v) => {
    if (v.ipAddress) {
      const browser = v.browser || "unknown";
      if (!byBrowser[browser]) {
        byBrowser[browser] = new Set();
      }
      byBrowser[browser].add(v.ipAddress);
    }
  });

  // Referrer breakdown (count unique IPs per referrer)
  const byReferrer: Record<string, Set<string>> = {};
  visits.forEach((v) => {
    if (v.ipAddress) {
      const referrer = v.referrerType || "direct";
      if (!byReferrer[referrer]) {
        byReferrer[referrer] = new Set();
      }
      byReferrer[referrer].add(v.ipAddress);
    }
  });

  // Time patterns (hourly) - count unique IPs per hour
  const byHour: Record<number, Set<string>> = {};
  visits.forEach((v) => {
    if (v.ipAddress) {
      const hour = new Date(v.timestamp).getHours();
      if (!byHour[hour]) {
        byHour[hour] = new Set();
      }
      byHour[hour].add(v.ipAddress);
    }
  });

  // Time patterns (day of week) - count unique IPs per day
  const byDayOfWeek: Record<string, Set<string>> = {};
  visits.forEach((v) => {
    if (v.ipAddress) {
      const day = new Date(v.timestamp).toLocaleDateString("en-US", { weekday: "long" });
      if (!byDayOfWeek[day]) {
        byDayOfWeek[day] = new Set();
      }
      byDayOfWeek[day].add(v.ipAddress);
    }
  });

  // Top pages (count unique visits per page)
  const byPage: Record<string, Set<string>> = {};
  visits.forEach((v) => {
    const key = `${v.type}:${v.slug}`;
    if (!byPage[key]) {
      byPage[key] = new Set();
    }
    if (v.ipAddress) {
      byPage[key].add(v.ipAddress);
    }
  });

  const topPages = Object.entries(byPage)
    .map(([key, uniqueIPs]) => {
      const [type, slug] = key.split(":");
      return { type, slug, count: uniqueIPs.size };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total: uniqueVisits.size, // Total unique visits
    byCountry: Object.entries(byCountry)
      .map(([country, uniqueIPs]) => ({ country, count: uniqueIPs.size }))
      .sort((a, b) => b.count - a.count),
    byCity: Object.entries(byCity)
      .map(([city, uniqueIPs]) => ({ city, count: uniqueIPs.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    byDevice: Object.entries(byDevice).map(([device, uniqueIPs]) => ({ device, count: uniqueIPs.size })),
    byBrowser: Object.entries(byBrowser)
      .map(([browser, uniqueIPs]) => ({ browser, count: uniqueIPs.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    byReferrer: Object.entries(byReferrer).map(([referrer, uniqueIPs]) => ({ referrer, count: uniqueIPs.size })),
    byHour: Object.entries(byHour)
      .map(([hour, uniqueIPs]) => ({ hour: parseInt(hour), count: uniqueIPs.size }))
      .sort((a, b) => a.hour - b.hour),
    byDayOfWeek: Object.entries(byDayOfWeek).map(([day, uniqueIPs]) => ({ day, count: uniqueIPs.size })),
    topPages,
  };
}

/**
 * Get unique visit statistics by type (safari vs tour)
 */
export async function getUniqueVisitStatsByType(): Promise<{
  safaris: { total: number; pages: number };
  tours: { total: number; pages: number };
}> {
  const data = await readAnalyticsFromStorage();
  
  // Filter out excluded IPs
  const visits = data.visits.filter((v) => !isIPExcluded(v.ipAddress));
  
  // Count unique visits per type
  const safariUniqueIPs = new Set<string>();
  const tourUniqueIPs = new Set<string>();
  const safariPages = new Set<string>();
  const tourPages = new Set<string>();
  
  visits.forEach((v) => {
    if (v.ipAddress) {
      if (v.type === "safari") {
        safariUniqueIPs.add(v.ipAddress);
        safariPages.add(v.slug);
      } else if (v.type === "tour") {
        tourUniqueIPs.add(v.ipAddress);
        tourPages.add(v.slug);
      }
    }
  });
  
  return {
    safaris: {
      total: safariUniqueIPs.size,
      pages: safariPages.size,
    },
    tours: {
      total: tourUniqueIPs.size,
      pages: tourPages.size,
    },
  };
}

/**
 * Get total unique visits across all pages
 */
export async function getTotalUniqueVisits(): Promise<number> {
  const data = await readAnalyticsFromStorage();
  
  // Filter out excluded IPs
  const visits = data.visits.filter((v) => !isIPExcluded(v.ipAddress));
  
  // Count unique IPs across all visits
  const uniqueIPs = new Set<string>();
  visits.forEach((v) => {
    if (v.ipAddress) {
      uniqueIPs.add(v.ipAddress);
    }
  });
  
  return uniqueIPs.size;
}

/**
 * Get recent visits
 */
export async function getRecentVisits(limit: number = 50): Promise<VisitRecord[]> {
  const data = await readAnalyticsFromStorage();
  // Filter out excluded IPs
  const filteredVisits = data.visits.filter((v) => !isIPExcluded(v.ipAddress));
  return filteredVisits
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

