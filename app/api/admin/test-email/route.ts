// app/api/admin/test-email/route.ts
// Test endpoint to verify email sending works

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to } = body;
    
    if (!to || !to.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address required" },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      subject: "Test Email from Savana Blu",
      html: `
        <div style="font-family: system-ui, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>This is a test email from your Savana Blu booking system.</p>
          <p>If you received this, your email configuration is working correctly!</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    // Check if it was actually sent
    if (result && 'stub' in result && result.stub) {
      return NextResponse.json({
        success: false,
        message: "Email NOT sent - RESEND_API_KEY not configured",
        error: result.error,
        instructions: "Add RESEND_API_KEY to Vercel environment variables",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      emailId: result?.id,
      to,
    });
  } catch (error: any) {
    console.error("[Test Email] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to send test email",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}


