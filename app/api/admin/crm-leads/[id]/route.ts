import { NextResponse } from "next/server";
import { updateCrmLead, type CrmLeadStatus } from "@/lib/data/crm-leads";

type RouteParams = {
  params: { id: string };
};

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = params;

  try {
    const body = await req.json();

    const status = body.status as CrmLeadStatus | undefined;
    const followUpDate =
      typeof body.followUpDate === "string" && body.followUpDate.trim()
        ? body.followUpDate
        : undefined;
    const internalNotes =
      typeof body.internalNotes === "string" ? body.internalNotes : undefined;
    const newNote =
      typeof body.newNote === "string" && body.newNote.trim()
        ? body.newNote
        : undefined;

    const updated = await updateCrmLead(id, {
      status,
      followUpDate,
      internalNotes,
      newNote,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (err) {
    console.error("CRM update error:", err);
    return NextResponse.json(
      { error: "Unable to update lead" },
      { status: 500 }
    );
  }
}

