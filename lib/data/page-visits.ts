// lib/data/page-visits.ts

import fs from "fs/promises";
import path from "path";

const VISITS_PATH = path.join(process.cwd(), "data", "page-visits.json");
const REDIS_VISITS_KEY = "savanablu:page-visits";

// Lazy load Redis client (only when needed)
let redisClient: any = null;
async function getRedis(): Promise<any> {
  // Only try to use Redis if REDIS_URL is present
  if (!process.env.REDIS_URL) {
    return null;
  }

  // Return existing client if already created
  if (redisClient) {
    return redisClient;
  }

  try {
    const Redis = (await import("ioredis")).default;
    redisClient = new Redis(process.env.REDIS_URL);
    
    // Handle connection errors
    redisClient.on("error", (err: any) => {
      console.warn("[Page Visits] Redis connection error:", err.message);
      redisClient = null; // Reset on error
    });

    return redisClient;
  } catch (err: any) {
    console.warn("[Page Visits] Redis not available:", err.message);
    return null;
  }
}

export type PageVisit = {
  slug: string;
  type: "safari" | "tour";
  count: number;
  lastVisited?: string;
};

export type PageVisitsData = {
  visits: PageVisit[];
  totalVisits: number;
  lastUpdated: string;
};

/**
 * Read page visits from Redis (if available) or fallback to file system
 */
async function readVisitsFromStorage(): Promise<PageVisitsData> {
  const defaultData: PageVisitsData = {
    visits: [],
    totalVisits: 0,
    lastUpdated: new Date().toISOString(),
  };

  // Try Redis first (works on Vercel with REDIS_URL)
  const redis = await getRedis();
  if (redis) {
    try {
      const data = await redis.get(REDIS_VISITS_KEY);
      if (data) {
        const parsed = JSON.parse(data) as PageVisitsData;
        if (parsed && typeof parsed === "object") {
          console.log(`[Page Visits] Read ${parsed.visits.length} page visit records from Redis`);
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn("[Page Visits] Error reading from Redis:", err.message);
    }
  }

  // Fallback to file system (works locally)
  try {
    const raw = await fs.readFile(VISITS_PATH, "utf-8");
    const data = JSON.parse(raw) as PageVisitsData;
    if (data && typeof data === "object") {
      console.log(`[Page Visits] Read ${data.visits.length} page visit records from file system`);
      return data;
    }
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.warn("[Page Visits] Error reading from file system:", err.message);
    }
  }

  return defaultData;
}

/**
 * Write page visits to Redis (if available) and/or file system
 */
async function writeVisitsToStorage(data: PageVisitsData): Promise<void> {
  let redisSuccess = false;
  let fileSuccess = false;

  // Try Redis first (primary storage on Vercel)
  const redis = await getRedis();
  if (redis) {
    try {
      await redis.set(REDIS_VISITS_KEY, JSON.stringify(data));
      redisSuccess = true;
      console.log(`[Page Visits] Saved ${data.visits.length} page visit records to Redis`);
    } catch (err: any) {
      console.warn("[Page Visits] Error writing to Redis:", err.message);
    }
  }

  // Also try file system (works locally and as backup)
  try {
    await fs.mkdir(path.dirname(VISITS_PATH), { recursive: true });
    await fs.writeFile(VISITS_PATH, JSON.stringify(data, null, 2), "utf-8");
    fileSuccess = true;
    console.log(`[Page Visits] Saved ${data.visits.length} page visit records to file system`);
  } catch (err: any) {
    console.warn("[Page Visits] Error writing to file system:", err.message);
  }

  if (!redisSuccess && !fileSuccess) {
    throw new Error("Failed to save page visits to both Redis and file system");
  }
}

/**
 * Get all page visits
 */
export async function getPageVisits(): Promise<PageVisitsData> {
  return await readVisitsFromStorage();
}

/**
 * Get visit count for a specific page
 */
export async function getPageVisitCount(
  slug: string,
  type: "safari" | "tour"
): Promise<number> {
  const data = await readVisitsFromStorage();
  const visit = data.visits.find(
    (v) => v.slug === slug && v.type === type
  );
  return visit?.count || 0;
}

/**
 * Increment visit count for a page
 */
export async function incrementPageVisit(
  slug: string,
  type: "safari" | "tour"
): Promise<number> {
  const data = await readVisitsFromStorage();
  const now = new Date().toISOString();

  // Find existing visit record
  const existingIndex = data.visits.findIndex(
    (v) => v.slug === slug && v.type === type
  );

  if (existingIndex >= 0) {
    // Update existing record
    data.visits[existingIndex].count += 1;
    data.visits[existingIndex].lastVisited = now;
  } else {
    // Create new record
    data.visits.push({
      slug,
      type,
      count: 1,
      lastVisited: now,
    });
  }

  // Update totals
  data.totalVisits = data.visits.reduce((sum, v) => sum + v.count, 0);
  data.lastUpdated = now;

  // Save to storage
  await writeVisitsToStorage(data);

  // Return the new count
  const updatedVisit = data.visits.find(
    (v) => v.slug === slug && v.type === type
  );
  return updatedVisit?.count || 0;
}

/**
 * Get top visited pages
 */
export async function getTopVisitedPages(limit: number = 10): Promise<PageVisit[]> {
  const data = await readVisitsFromStorage();
  return data.visits
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get visit statistics by type
 */
export async function getVisitStatsByType(): Promise<{
  safaris: { total: number; pages: number };
  tours: { total: number; pages: number };
}> {
  const data = await readVisitsFromStorage();
  const safaris = data.visits.filter((v) => v.type === "safari");
  const tours = data.visits.filter((v) => v.type === "tour");

  return {
    safaris: {
      total: safaris.reduce((sum, v) => sum + v.count, 0),
      pages: safaris.length,
    },
    tours: {
      total: tours.reduce((sum, v) => sum + v.count, 0),
      pages: tours.length,
    },
  };
}

