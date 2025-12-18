import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const LEADS_PATH = path.join(process.cwd(), "data", "crm-leads.json");

type PackageEnquiryPayload = {
  packageSlug: string;
  packageTitle: string;
  name: string;
  email: string;
  phone?: string;
  dates?: string;
  guests?: string;
  message?: string;
};

async function readLeads() {
  try {
    const raw = await fs.readFile(LEADS_PATH, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function writeLeads(leads: any[]) {
  await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2), "utf8");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PackageEnquiryPayload;

    if (!body.name || !body.email || !body.packageSlug) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const leads = await readLeads();
    const now = new Date().toISOString();

    const newLead = {
      id: `pkg-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      source: "package-enquiry",
      packageSlug: body.packageSlug,
      packageTitle: body.packageTitle,
      name: body.name,
      email: body.email,
      phone: body.phone ?? "",
      dates: body.dates ?? "",
      guests: body.guests ?? "",
      message: body.message ?? "",
      status: "new"
    };

    leads.push(newLead);
    await writeLeads(leads);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error handling package enquiry:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
