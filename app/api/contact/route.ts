import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import {
  sendEmail,
  enquiryCustomerEmail,
  enquiryOperatorEmail,
  type EnquiryPayload,
} from "@/lib/email";

const CRM_LEADS_PATH = path.join(
  process.cwd(),
  "data",
  "crm-leads.json"
);

async function appendLead(lead: any) {
  // On Vercel, filesystem is read-only except /tmp
  // Try to write, but don't fail if it's not possible
  let current: any[] = [];
  try {
    const raw = await fs.readFile(CRM_LEADS_PATH, "utf8");
    current = JSON.parse(raw);
    if (!Array.isArray(current)) {
      current = [];
    }
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      // Log but don't throw - filesystem might be read-only on Vercel
      console.warn("Could not read CRM leads file:", err.message);
      return; // Exit early if we can't read
    }
  }

  current.push(lead);

  try {
    await fs.writeFile(
      CRM_LEADS_PATH,
      JSON.stringify(current, null, 2),
      "utf8"
    );
  } catch (err: any) {
    // On Vercel, filesystem is read-only - log but don't fail
    console.warn("Could not write CRM leads file (filesystem may be read-only):", err.message);
    // Don't throw - continue with email sending
  }
}

async function checkRecentDuplicate(email: string, withinMinutes: number = 5): Promise<boolean> {
  try {
    const raw = await fs.readFile(CRM_LEADS_PATH, "utf8");
    const current = JSON.parse(raw);
    if (!Array.isArray(current)) {
      return false;
    }

    const now = Date.now();
    const threshold = now - withinMinutes * 60 * 1000;

    return current.some((lead: any) => {
      if (lead.email?.toLowerCase() !== email.toLowerCase()) {
        return false;
      }
      const createdAt = new Date(lead.createdAt).getTime();
      return createdAt > threshold;
    });
  } catch (err: any) {
    // On Vercel, filesystem is read-only - fail open (allow submission)
    if (err.code === "ENOENT" || err.code === "EACCES" || err.code === "EROFS") {
      console.warn("Could not check for duplicates (filesystem may be read-only):", err.message);
      return false;
    }
    // On error, allow submission (fail open)
    return false;
  }
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, email, phone, message, preferredTour, dates, accommodation, captchaAnswer, captchaQuestion, company } = body;

    // Honeypot: if company is filled, silently treat as spam and pretend OK.
    if (typeof company === "string" && company.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate math captcha
    if (captchaQuestion && typeof captchaQuestion === "string") {
      // Parse question like "3 + 4" to calculate expected answer
      const match = captchaQuestion.match(/^(\d+)\s*\+\s*(\d+)$/);
      if (match) {
        const num1 = parseInt(match[1], 10);
        const num2 = parseInt(match[2], 10);
        const expectedAnswer = num1 + num2;
        const userAnswer = parseInt(String(captchaAnswer).trim(), 10);
        
        if (isNaN(userAnswer) || userAnswer !== expectedAnswer) {
          return NextResponse.json(
            { success: false, error: "Invalid captcha answer." },
            { status: 400 }
          );
        }
      } else {
        // Fallback: if question format is invalid, reject
        return NextResponse.json(
          { success: false, error: "Invalid captcha question format." },
          { status: 400 }
        );
      }
    } else {
      // If no question provided, reject
      return NextResponse.json(
        { success: false, error: "Captcha question is required." },
        { status: 400 }
      );
    }

    // Validate phone number format if provided
    if (phone && typeof phone === "string") {
      const phonePattern = /^[\d\s+\-()]+$/;
      if (!phonePattern.test(phone.trim())) {
        return NextResponse.json(
          { error: "Phone number contains invalid characters. Please use only numbers, +, spaces, dashes, and parentheses." },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (email && typeof email === "string") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        return NextResponse.json(
          { error: "Please enter a valid email address." },
          { status: 400 }
        );
      }
    }

    const payload: EnquiryPayload = {
      name: name || "",
      email: email || "",
      phone: phone || "",
      message: message || "",
      preferredTour: preferredTour || "",
      dates: dates || "",
      accommodation: accommodation || "",
    };

    if (!payload.name || !payload.email || !payload.phone) {
      return NextResponse.json(
        { error: "Name, email, and WhatsApp number are required fields." },
        { status: 400 }
      );
    }

    // Check for duplicate submission within last 5 minutes
    const isDuplicate = await checkRecentDuplicate(payload.email, 5);
    
    if (isDuplicate) {
      // Return success but don't send emails or create duplicate lead
      console.log(`Duplicate contact form submission detected for ${payload.email} within last 5 minutes. Skipping email and lead creation.`);
      return NextResponse.json({ success: true, duplicate: true });
    }

    const lead = {
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: "contact-form",
      status: "new",
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.message,
      preferredTour: payload.preferredTour,
      dates: payload.dates,
      accommodation: payload.accommodation,
    };

    // Try to save lead, but don't fail if filesystem is read-only
    try {
      await appendLead(lead);
    } catch (leadError: any) {
      console.warn("Could not save lead to file (this is OK on Vercel):", leadError?.message);
      // Continue with email sending even if file write fails
    }

    // Send emails with better error handling
    let emailErrors: string[] = [];
    
    try {
      console.log("Sending customer email to:", payload.email);
      const customerEmailResult = await sendEmail({
        to: payload.email,
        subject: "We've received your enquiry – Savana Blu Zanzibar",
        html: enquiryCustomerEmail(payload),
      });
      console.log("Customer email sent successfully:", customerEmailResult);
    } catch (err: any) {
      const errorMsg = `Customer email failed: ${err?.message || String(err)}`;
      console.error(errorMsg);
      emailErrors.push(errorMsg);
    }

    try {
      console.log("Sending admin email to: hello@savanablu.com");
      const adminEmailResult = await sendEmail({
        to: "hello@savanablu.com",
        subject: "New website enquiry – Savana Blu",
        html: enquiryOperatorEmail(payload),
      });
      console.log("Admin email sent successfully:", adminEmailResult);
    } catch (err: any) {
      const errorMsg = `Admin email failed: ${err?.message || String(err)}`;
      console.error(errorMsg);
      emailErrors.push(errorMsg);
    }

    // Still return success even if emails fail (lead is saved)
    if (emailErrors.length > 0) {
      console.error("Some emails failed to send:", emailErrors);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact API error:", err);
    console.error("Error stack:", err?.stack);
    return NextResponse.json(
      { 
        error: "Unable to submit your enquiry right now.",
        details: process.env.NODE_ENV === "development" ? err?.message : undefined
      },
      { status: 500 }
    );
  }
}
