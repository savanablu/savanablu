"use client";

import { useEffect, useState } from "react";

type SearchQuery = {
  query: string;
  count: number;
  lastSeen: string;
};

type SearchEngineStats = {
  google: number;
  bing: number;
  yahoo: number;
  duckduckgo: number;
  other: number;
  total: number;
};

type SEOSummary = {
  searchQueries: SearchQuery[];
  searchEngineStats: SearchEngineStats;
  organicSearchVisits: number;
  topSearchPages: Array<{
    path: string;
    visits: number;
    queries: string[];
  }>;
};

export default function SEODashboard() {
  const [data, setData] = useState<SEOSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/seo-stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("[SEO Dashboard] Received data:", data);
        if (data.error) {
          console.error("[SEO Dashboard] API returned error:", data.error);
          setData(null);
        } else {
          setData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("[SEO Dashboard] Error loading SEO stats:", err);
        setData(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-8 text-center">
        <p className="text-white/70">Loading SEO data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-8 text-center">
        <p className="text-white/70 mb-2">No SEO data available</p>
        <p className="text-sm text-white/50">
          SEO tracking will populate as visitors arrive from search engines (Google, Bing, etc.)
        </p>
      </div>
    );
  }

  const { 
    searchQueries = [], 
    searchEngineStats = {
      google: 0,
      bing: 0,
      yahoo: 0,
      duckduckgo: 0,
      other: 0,
      total: 0,
    }, 
    organicSearchVisits = 0, 
    topSearchPages = [] 
  } = data;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
            Organic Search Visits
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {(organicSearchVisits || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
            Unique Search Queries
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {(searchQueries?.length || 0)}
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
            Google Visits
          </p>
          <p className="mt-2 text-3xl font-semibold text-emerald-400">
            {(searchEngineStats?.google || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search Engine Breakdown */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Search Engine Traffic
        </h3>
        <div className="grid gap-3 sm:grid-cols-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Google</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {searchEngineStats?.google || 0}
            </p>
            <p className="text-xs text-white/70">
              {(searchEngineStats?.total || 0) > 0
                ? (((searchEngineStats?.google || 0) / (searchEngineStats?.total || 1)) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Bing</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {searchEngineStats?.bing || 0}
            </p>
            <p className="text-xs text-white/70">
              {(searchEngineStats?.total || 0) > 0
                ? (((searchEngineStats?.bing || 0) / (searchEngineStats?.total || 1)) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Yahoo</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {searchEngineStats?.yahoo || 0}
            </p>
            <p className="text-xs text-white/70">
              {(searchEngineStats?.total || 0) > 0
                ? (((searchEngineStats?.yahoo || 0) / (searchEngineStats?.total || 1)) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">DuckDuckGo</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {searchEngineStats?.duckduckgo || 0}
            </p>
            <p className="text-xs text-white/70">
              {(searchEngineStats?.total || 0) > 0
                ? (((searchEngineStats?.duckduckgo || 0) / (searchEngineStats?.total || 1)) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Other</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {searchEngineStats?.other || 0}
            </p>
            <p className="text-xs text-white/70">
              {(searchEngineStats?.total || 0) > 0
                ? (((searchEngineStats?.other || 0) / (searchEngineStats?.total || 1)) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Top Search Queries */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Top Search Queries
        </h3>
        <div className="space-y-2">
          {(searchQueries || []).slice(0, 20).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{item.query}</p>
                <p className="text-xs text-white/70">
                  Last seen: {new Date(item.lastSeen).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-lg font-semibold text-emerald-400">
                  {item.count}
                </p>
                <p className="text-xs text-white/70">visits</p>
              </div>
            </div>
          ))}
          {(!searchQueries || searchQueries.length === 0) && (
            <div className="py-8 text-center">
              <p className="text-white/70 mb-2">No search queries tracked yet</p>
              <p className="text-xs text-white/50">
                Search queries will appear here when visitors arrive from Google, Bing, or other search engines
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Pages from Search */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Top Pages from Search
        </h3>
        <div className="space-y-2">
          {(topSearchPages || []).slice(0, 15).map((page, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{page.path}</p>
                {page.queries.length > 0 && (
                  <p className="mt-1 text-xs text-white/70">
                    Queries: {page.queries.join(", ")}
                  </p>
                )}
              </div>
              <div className="ml-4 text-right">
                <p className="text-lg font-semibold text-emerald-400">
                  {page.visits}
                </p>
                <p className="text-xs text-white/70">visits</p>
              </div>
            </div>
          ))}
          {(!topSearchPages || topSearchPages.length === 0) && (
            <div className="py-8 text-center">
              <p className="text-white/70 mb-2">No search traffic to pages yet</p>
              <p className="text-xs text-white/50">
                Pages will appear here once visitors arrive from search engines
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

