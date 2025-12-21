// lib/analytics/geolocation.ts

/**
 * Get geolocation from request headers (Vercel provides this)
 * Falls back to IP geolocation API if needed
 */
export async function getLocationFromRequest(
  headers: Headers | Record<string, string | string[] | undefined>
): Promise<{ country?: string; city?: string }> {
  // Try Vercel's geolocation headers first (available on Vercel)
  const country = 
    (headers.get?.("x-vercel-ip-country") as string) ||
    (headers["x-vercel-ip-country"] as string) ||
    undefined;
  
  const city = 
    (headers.get?.("x-vercel-ip-city") as string) ||
    (headers["x-vercel-ip-city"] as string) ||
    undefined;

  if (country) {
    return { country, city };
  }

  // Fallback: Try to get IP and use free geolocation API
  const ip = 
    (headers.get?.("x-forwarded-for") as string)?.split(",")[0]?.trim() ||
    (headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (headers.get?.("x-real-ip") as string) ||
    (headers["x-real-ip"] as string) ||
    undefined;

  if (ip && !ip.startsWith("127.") && !ip.startsWith("192.168.") && !ip.startsWith("10.")) {
    try {
      // Use ip-api.com (free, no API key needed, rate limited)
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
        headers: {
          "User-Agent": "SavanaBlu/1.0",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          return {
            country: data.country || undefined,
            city: data.city || undefined,
          };
        }
      }
    } catch (err) {
      // Silently fail - geolocation is optional
      console.warn("[Geolocation] Failed to fetch location:", err);
    }
  }

  return {};
}

/**
 * Parse user agent to get device and browser info
 */
export function parseUserAgent(userAgent?: string): {
  device: "desktop" | "mobile" | "tablet";
  browser: string;
} {
  if (!userAgent) {
    return { device: "desktop", browser: "unknown" };
  }

  const ua = userAgent.toLowerCase();

  // Detect device
  let device: "desktop" | "mobile" | "tablet" = "desktop";
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    device = "mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    device = "tablet";
  }

  // Detect browser
  let browser = "unknown";
  if (ua.includes("chrome") && !ua.includes("edg")) {
    browser = "Chrome";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
  }

  return { device, browser };
}

/**
 * Parse referrer to determine referrer type
 */
export function parseReferrer(referrer?: string): {
  referrer: string | undefined;
  referrerType: "direct" | "search" | "social" | "other";
} {
  if (!referrer) {
    return { referrer: undefined, referrerType: "direct" };
  }

  const ref = referrer.toLowerCase();

  // Search engines
  if (
    ref.includes("google") ||
    ref.includes("bing") ||
    ref.includes("yahoo") ||
    ref.includes("duckduckgo") ||
    ref.includes("baidu") ||
    ref.includes("yandex")
  ) {
    return { referrer, referrerType: "search" };
  }

  // Social media
  if (
    ref.includes("facebook") ||
    ref.includes("twitter") ||
    ref.includes("instagram") ||
    ref.includes("linkedin") ||
    ref.includes("pinterest") ||
    ref.includes("reddit") ||
    ref.includes("youtube")
  ) {
    return { referrer, referrerType: "social" };
  }

  // Same domain (internal)
  if (ref.includes("savanablu.com")) {
    return { referrer: undefined, referrerType: "direct" };
  }

  return { referrer, referrerType: "other" };
}

