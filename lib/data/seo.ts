// lib/data/seo.ts

import { readAnalyticsFromStorage, type AnalyticsData } from "./analytics";
import { isIPExcluded } from "./analytics";

export type SearchQuery = {
  query: string;
  count: number;
  lastSeen: string;
  referrer: string;
};

export type SearchEngineStats = {
  google: number;
  bing: number;
  yahoo: number;
  duckduckgo: number;
  other: number;
  total: number;
};

export type SEOSummary = {
  searchQueries: SearchQuery[];
  searchEngineStats: SearchEngineStats;
  organicSearchVisits: number;
  topSearchPages: Array<{
    path: string;
    visits: number;
    queries: string[];
  }>;
};

/**
 * Extract search query from referrer URL
 */
function extractSearchQuery(referrer: string): string | null {
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();
    
    // Google
    if (hostname.includes("google")) {
      return url.searchParams.get("q") || null;
    }
    
    // Bing
    if (hostname.includes("bing")) {
      return url.searchParams.get("q") || null;
    }
    
    // Yahoo
    if (hostname.includes("yahoo")) {
      return url.searchParams.get("p") || null;
    }
    
    // DuckDuckGo
    if (hostname.includes("duckduckgo")) {
      return url.searchParams.get("q") || null;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Identify search engine from referrer
 */
function identifySearchEngine(referrer: string): "google" | "bing" | "yahoo" | "duckduckgo" | "other" | null {
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();
    
    if (hostname.includes("google")) return "google";
    if (hostname.includes("bing")) return "bing";
    if (hostname.includes("yahoo")) return "yahoo";
    if (hostname.includes("duckduckgo")) return "duckduckgo";
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Get SEO summary from analytics data
 */
export async function getSEOSummary(): Promise<SEOSummary> {
  const data = await readAnalyticsFromStorage();
  
  // Filter out excluded IPs
  const visits = data.visits.filter((v) => !isIPExcluded(v.ipAddress));
  
  // Filter for search engine referrers
  const searchVisits = visits.filter((v) => {
    if (!v.referrer || v.referrerType !== "search") return false;
    return identifySearchEngine(v.referrer) !== null;
  });
  
  // Extract search queries - count unique IPs per query (not total visits)
  const queryMap = new Map<string, { 
    uniqueIPs: Set<string>; 
    lastSeen: string; 
    referrer: string;
  }>();
  
  searchVisits.forEach((visit) => {
    const query = extractSearchQuery(visit.referrer || "");
    if (query && visit.ipAddress) {
      const queryKey = query.toLowerCase();
      const existing = queryMap.get(queryKey);
      if (existing) {
        existing.uniqueIPs.add(visit.ipAddress);
        if (visit.timestamp > existing.lastSeen) {
          existing.lastSeen = visit.timestamp;
        }
      } else {
        queryMap.set(queryKey, {
          uniqueIPs: new Set([visit.ipAddress]),
          lastSeen: visit.timestamp,
          referrer: visit.referrer || "",
        });
      }
    }
  });
  
  // Convert to array and sort by unique IP count
  const searchQueries: SearchQuery[] = Array.from(queryMap.entries())
    .map(([query, data]) => ({
      query,
      count: data.uniqueIPs.size, // Count unique IPs, not total visits
      lastSeen: data.lastSeen,
      referrer: data.referrer,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50); // Top 50 queries
  
  // Count by search engine
  const engineCounts: SearchEngineStats = {
    google: 0,
    bing: 0,
    yahoo: 0,
    duckduckgo: 0,
    other: 0,
    total: searchVisits.length,
  };
  
  searchVisits.forEach((visit) => {
    const engine = identifySearchEngine(visit.referrer || "");
    if (engine === "google") engineCounts.google++;
    else if (engine === "bing") engineCounts.bing++;
    else if (engine === "yahoo") engineCounts.yahoo++;
    else if (engine === "duckduckgo") engineCounts.duckduckgo++;
    else if (engine) engineCounts.other++;
  });
  
  // Top pages from search - count unique IPs per page (not total visits)
  const pageMap = new Map<string, { 
    uniqueIPs: Set<string>; 
    queries: Set<string> 
  }>();
  
  searchVisits.forEach((visit) => {
    if (!visit.ipAddress) return; // Skip visits without IP
    
    const path = `/${visit.type}/${visit.slug}`;
    const query = extractSearchQuery(visit.referrer || "");
    
    const existing = pageMap.get(path);
    if (existing) {
      existing.uniqueIPs.add(visit.ipAddress);
      if (query) existing.queries.add(query);
    } else {
      pageMap.set(path, {
        uniqueIPs: new Set([visit.ipAddress]),
        queries: new Set(query ? [query] : []),
      });
    }
  });
  
  const topSearchPages = Array.from(pageMap.entries())
    .map(([path, data]) => ({
      path,
      visits: data.uniqueIPs.size, // Count unique IPs, not total visits
      queries: Array.from(data.queries).slice(0, 5),
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 20);
  
  return {
    searchQueries,
    searchEngineStats: engineCounts,
    organicSearchVisits: searchVisits.length,
    topSearchPages,
  };
}

