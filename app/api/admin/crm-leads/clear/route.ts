// app/api/admin/crm-leads/clear/route.ts
// API endpoint to clear all CRM leads/enquiries data

import { NextResponse } from "next/server";
import { writeCrmLeadsData } from "@/lib/data/crm-leads";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  try {
    // Clear all CRM leads by writing an empty array
    await writeCrmLeadsData([]);
    
    return NextResponse.json({ 
      success: true, 
      message: "All enquiries cleared successfully",
      count: 0
    });
  } catch (err: any) {
    console.error("Error clearing enquiries:", err);
    return NextResponse.json(
      { error: "Failed to clear enquiries", message: err.message },
      { status: 500 }
    );
  }
}

