"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  redirectTo: string;
};

export default function AdminLoginForm({ redirectTo }: Props) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid passcode");
      }

      router.push(redirectTo || "/admin");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 rounded-2xl bg-white/95 p-6 shadow-sm"
    >
      <div className="space-y-1 text-sm">
        <label
          htmlFor="admin-passcode"
          className="text-[0.9rem] font-semibold text-sb-night"
        >
          Admin passcode
        </label>
        <input
          id="admin-passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/70 px-3 py-2 text-[0.85rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
          placeholder="Enter the passcode"
          autoComplete="off"
        />
        <p className="text-[0.78rem] text-sb-ink/60">
          This passcode is shared only with your core team and configured in
          your environment as <code>ADMIN_PASSCODE</code>.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !passcode}
          className="rounded-full bg-sb-night px-5 py-2 text-[0.85rem] font-semibold text-sb-shell hover:bg-sb-ocean disabled:opacity-60"
        >
          {loading ? "Checking…" : "Enter admin"}
        </button>
      </div>
    </form>
  );
}

