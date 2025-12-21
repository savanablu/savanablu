// lib/analytics/geolocation.ts

/**
 * Get IP address from request headers
 * Vercel provides x-forwarded-for or x-real-ip
 */
export function getIPFromRequest(headers: Headers): string | undefined {
  // Try Vercel's forwarded IP first
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const firstIP = forwardedFor.split(",")[0].trim();
    if (firstIP) {
      return firstIP;
    }
  }

  // Try x-real-ip (some proxies use this)
  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }

  // Try CF-Connecting-IP (Cloudflare)
  const cfIP = headers.get("cf-connecting-ip");
  if (cfIP) {
    return cfIP.trim();
  }

  return undefined;
}

/**
 * Get geolocation from request headers (Vercel provides this automatically)
 * Vercel automatically adds x-vercel-ip-country and x-vercel-ip-city headers
 */
export async function getLocationFromRequest(
  headers: Headers
): Promise<{ country?: string; city?: string }> {
  // Vercel automatically provides geolocation headers
  const country = headers.get("x-vercel-ip-country") || undefined;
  const city = headers.get("x-vercel-ip-city") || undefined;

  return { country, city };
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

