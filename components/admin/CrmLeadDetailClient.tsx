"use client";

import { useState, useEffect } from "react";
import type { CrmLead, CrmLeadStatus } from "@/lib/data/crm-leads";

type Props = {
  lead: CrmLead;
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildWhatsAppUrl(phone: string, name: string): string {
  const message = encodeURIComponent(`Hi ${name},`);
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${message}`;
}

const STATUS_OPTIONS: { value: CrmLeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in-progress", label: "In progress" },
  { value: "closed-won", label: "Booked" },
  { value: "closed-lost", label: "Lost" },
];

export default function CrmLeadDetailClient({ lead }: Props) {
  const [status, setStatus] = useState<CrmLeadStatus>(lead.status);
  const [followUpDate, setFollowUpDate] = useState(
    lead.followUpDate ? lead.followUpDate.slice(0, 10) : ""
  );
  const [internalNotes, setInternalNotes] = useState(
    lead.internalNotes ?? ""
  );
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState(lead.notes || []);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/crm-leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          followUpDate: followUpDate || null,
          internalNotes,
          newNote: newNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save");
      }

      // Update local notes state if a new note was added
      if (newNote.trim() && data.lead?.notes) {
        setNotes(data.lead.notes);
        setNewNote("");
      }

      setMessage("Lead updated.");
    } catch (err) {
      console.error(err);
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
      {/* Left: lead summary */}
      <div className="space-y-4 rounded-2xl bg-white/95 p-5 shadow-sm">
        <h2 className="font-display text-sm text-sb-night">
          Lead summary
        </h2>

        <dl className="mt-2 grid gap-3 text-xs text-sb-ink/85 sm:grid-cols-2">
          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Name
            </dt>
            <dd className="mt-0.5 font-semibold text-sb-night">
              {lead.name}
            </dd>
          </div>
          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Email
            </dt>
            <dd className="mt-0.5">{lead.email}</dd>
          </div>
          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Phone
            </dt>
            <dd className="mt-0.5 flex items-center gap-2">
              {lead.phone || "–"}
              {lead.phone && (
                <a
                  href={buildWhatsAppUrl(lead.phone, lead.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[0.7rem] font-semibold text-white hover:bg-emerald-600"
                >
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.382 1.262.59 1.694.757.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Preferred tour
            </dt>
            <dd className="mt-0.5">{lead.preferredTour || "–"}</dd>
          </div>
          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Created
            </dt>
            <dd className="mt-0.5">
              {formatDate(lead.createdAt)} ·{" "}
              <span className="text-[0.78rem] text-sb-ink/60">
                {lead.source}
              </span>
            </dd>
          </div>
        </dl>

        {lead.message && (
          <div className="mt-4 rounded-xl bg-sb-shell/80 p-3 text-xs text-sb-ink/85">
            <h3 className="font-display text-[0.9rem] text-sb-night">
              Original message
            </h3>
            <p className="mt-1 whitespace-pre-wrap text-[0.85rem]">
              {lead.message}
            </p>
          </div>
        )}
      </div>

      {/* Right: follow-up & notes */}
      <div className="space-y-3 rounded-2xl bg-white/95 p-5 shadow-sm">
        <h2 className="font-display text-sm text-sb-night">
          Follow-up & notes
        </h2>

        {message && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-[0.78rem] text-emerald-700">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-[0.78rem] text-red-700">
            {error}
          </p>
        )}

        <div className="space-y-1 text-xs">
          <label className="text-[0.85rem] font-semibold text-sb-night">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CrmLeadStatus)}
            className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/70 px-3 py-2 text-[0.78rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-[0.85rem] font-semibold text-sb-night">
            Follow-up date
          </label>
          <input
            type="date"
            min={today}
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className={`w-full rounded-md border border-sb-mist/80 bg-sb-shell/70 px-3 py-2 text-[0.78rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70 ${
              followUpDate && followUpDate < today
                ? "bg-red-50 border-red-300"
                : ""
            }`}
          />
          {followUpDate && followUpDate < today && (
            <p className="text-[0.68rem] text-red-600">
              This date is in the past. Please select today or a future date.
            </p>
          )}
          <p className="text-[0.68rem] text-sb-ink/60">
            Use this to flag when you&apos;ve promised to get back to the
            guest (e.g. after checking guide availability).
          </p>
        </div>

        {/* Notes history */}
        {notes.length > 0 && (
          <div className="space-y-1 text-xs">
            <label className="text-[0.85rem] font-semibold text-sb-night">
              Notes history
            </label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-sb-mist/80 bg-sb-shell/70 p-3">
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  className="rounded-md bg-white/80 p-2 text-[0.75rem]"
                >
                  <p className="text-sb-ink/90">{note.note}</p>
                  <p className="mt-1 text-[0.7rem] text-sb-ink/60">
                    {formatDateTime(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1 text-xs">
          <label className="text-[0.85rem] font-semibold text-sb-night">
            Add new note
          </label>
          <textarea
            rows={4}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/70 px-3 py-2 text-[0.78rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
            placeholder="Add a new note (will be logged with current date and time)…"
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-[0.85rem] font-semibold text-sb-night">
            Internal notes (legacy)
          </label>
          <textarea
            rows={4}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/70 px-3 py-2 text-[0.78rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
            placeholder="Legacy notes field (use 'Add new note' above for dated notes)…"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-sb-night px-4 py-2 text-[0.9rem] font-semibold text-sb-shell hover:bg-sb-ocean disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>

        <p className="text-[0.68rem] text-sb-ink/60">
          Notes are internal only and are not sent to the guest.
        </p>
      </div>
    </div>
  );
}

