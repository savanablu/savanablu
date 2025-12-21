// app/api/admin/email-check/route.ts
// Diagnostic endpoint to check email configuration

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const hasApiKey = !!RESEND_API_KEY;
  const apiKeyPrefix = RESEND_API_KEY ? RESEND_API_KEY.substring(0, 10) + "..." : "not set";
  
  // Check if it's a valid-looking Resend API key (starts with "re_")
  const isValidFormat = RESEND_API_KEY?.startsWith("re_") || false;

  return NextResponse.json({
    configured: hasApiKey,
    apiKeyPrefix,
    isValidFormat,
    message: hasApiKey 
      ? (isValidFormat 
          ? "RESEND_API_KEY is configured and appears valid" 
          : "RESEND_API_KEY is set but format may be invalid (should start with 're_')")
      : "RESEND_API_KEY is not configured. Emails will not be sent.",
    instructions: !hasApiKey 
      ? "To fix: Add RESEND_API_KEY to your Vercel environment variables. Get your key from https://resend.com/api-keys"
      : !isValidFormat
      ? "The API key format looks incorrect. Resend API keys should start with 're_'"
      : "Email configuration looks good!",
  });
}

