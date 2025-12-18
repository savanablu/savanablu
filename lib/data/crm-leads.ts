import fs from "fs/promises";
import path from "path";

const CRM_LEADS_PATH = path.join(process.cwd(), "data", "crm-leads.json");

export type CrmLeadStatus =
  | "new"
  | "in-progress"
  | "closed-won"
  | "closed-lost";

export type CrmLeadNote = {
  note: string;
  createdAt: string; // ISO date string
};

export type CrmLead = {
  id: string;
  createdAt: string;
  source: string; // e.g. "contact-form", "manual"
  status: CrmLeadStatus;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredTour?: string;
  followUpDate?: string; // ISO date string
  internalNotes?: string; // Legacy: single string for backward compatibility
  notes?: CrmLeadNote[]; // New: array of notes with dates
};

export async function readCrmLeads(): Promise<CrmLead[]> {
  try {
    const raw = await fs.readFile(CRM_LEADS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function writeCrmLeads(leads: CrmLead[]) {
  await fs.writeFile(
    CRM_LEADS_PATH,
    JSON.stringify(leads, null, 2),
    "utf8"
  );
}

export async function getCrmLeadById(id: string): Promise<CrmLead | null> {
  const leads = await readCrmLeads();
  const found = leads.find((l) => l.id === id);
  return found ?? null;
}

export async function updateCrmLead(
  id: string,
  updates: Partial<Pick<CrmLead, "status" | "followUpDate" | "internalNotes">> & {
    newNote?: string;
  }
): Promise<CrmLead | null> {
  const leads = await readCrmLeads();
  let updated: CrmLead | null = null;

  const next = leads.map((lead) => {
    if (lead.id === id) {
      const { newNote, ...otherUpdates } = updates;
      
      // Initialize notes array if it doesn't exist
      const existingNotes = lead.notes || [];
      
      // If there's a new note, add it to the array
      let notes = existingNotes;
      if (newNote && newNote.trim()) {
        notes = [
          ...existingNotes,
          {
            note: newNote.trim(),
            createdAt: new Date().toISOString(),
          },
        ];
      }

      updated = {
        ...lead,
        ...otherUpdates,
        notes,
      };
      return updated;
    }
    return lead;
  });

  if (!updated) return null;

  await writeCrmLeads(next);
  return updated;
}

