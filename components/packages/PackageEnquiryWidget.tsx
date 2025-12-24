"use client";

import { useState } from "react";
import { CountrySelector } from "@/components/contact/CountrySelector";

type Props = {
  packageSlug: string;
  packageTitle: string;
};

export default function PackageEnquiryWidget({
  packageSlug,
  packageTitle
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countryCode, setCountryCode] = useState("+255"); // Default to Tanzania
  const [phoneNumber, setPhoneNumber] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    // Validate email before submission
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    setError(null);
    setEmailError("");

    try {
      const res = await fetch("/api/enquiries/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug,
          packageTitle,
          name,
          email,
          phone: phoneNumber.trim() ? `${countryCode}${phoneNumber.trim()}` : "",
          dates,
          guests,
          message
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send enquiry.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setDates("");
      setGuests("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sb-mist/80 bg-sb-shell/80 p-4 text-xs text-sb-ink">
        <h3 className="font-display text-sm text-sb-night">
          Thank you – your booking request is with us
        </h3>
        <p className="mt-2 text-[0.78rem] text-sb-ink/80">
          Our Zanzibar team will review your request for{" "}
          <span className="font-medium text-sb-night">{packageTitle}</span> and
          reply within 30 minutes during working hours (09:00–18:00, East Africa
          Time, GMT+3) with availability and a clear price before any payment is
          taken.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-sb-mist/80 bg-white/90 p-4 text-xs text-sb-ink shadow-sm"
    >
      <h3 className="font-display text-sm text-sb-night">
        Request this experience
      </h3>
      <p className="text-[0.78rem] text-sb-ink/75">
        Share who&apos;s travelling and your rough dates. This sends a booking
        request for{" "}
        <span className="font-medium text-sb-night">{packageTitle}</span> to
        our planners in Zanzibar – nothing is charged yet.
      </p>

      <div className="space-y-1">
        <label className="block text-[0.78rem] font-medium text-sb-ink/80">
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-3 py-1.5 text-[0.78rem] outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[0.78rem] font-medium text-sb-ink/80">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
            if (value && !validateEmail(value)) {
              setEmailError("Please enter a valid email address");
            } else {
              setEmailError("");
            }
          }}
          className={`w-full rounded-md border px-3 py-1.5 text-[0.78rem] outline-none focus:ring-1 ${
            emailError
              ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-400"
              : "border-sb-mist/80 bg-sb-shell/60 focus:border-sb-lagoon focus:ring-sb-lagoon/70"
          }`}
        />
        {emailError && (
          <p className="mt-0.5 text-[0.7rem] text-red-600">{emailError}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-[0.78rem] font-medium text-sb-ink/80">
          Phone / WhatsApp (optional)
        </label>
        <div className="flex">
          <CountrySelector
            value={countryCode}
            onChange={setCountryCode}
            className="flex-shrink-0"
          />
          <input
            type="tel"
            inputMode="numeric"
            pattern="\d+"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value;
              const cleaned = value.replace(/\D/g, "");
              setPhoneNumber(cleaned);
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = (e.clipboardData || (window as any).clipboardData).getData("text");
              const cleaned = pasted.replace(/\D/g, "");
              setPhoneNumber(cleaned);
            }}
            className="flex-1 rounded-r-md border border-l-0 border-sb-mist/80 bg-sb-shell/60 px-3 py-1.5 text-[0.78rem] outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
            placeholder="123456789"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-[0.78rem] font-medium text-sb-ink/80">
          Rough dates or month
        </label>
        <input
          type="text"
          placeholder="e.g. late July, or 5–9 August"
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-3 py-1.5 text-[0.78rem] outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[0.78rem] font-medium text-sb-ink/80">
          How many guests?
        </label>
        <input
          type="text"
          placeholder="e.g. 2 adults, 2 children (8 & 11)"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-3 py-1.5 text-[0.78rem] outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[0.78rem] font-medium text-sb-ink/80">
          Anything else we should know?
        </label>
        <textarea
          rows={3}
          placeholder="Special occasions, must-do experiences, pace you prefer…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-3 py-1.5 text-[0.78rem] outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
        />
      </div>

      {error && <p className="text-[0.78rem] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-sb-night px-4 py-2 text-[0.78rem] font-semibold text-sb-shell shadow-sm hover:bg-sb-ocean disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending your booking request…" : "Send booking request"}
      </button>

      <p className="text-[0.65rem] text-sb-ink/60">
        This does not charge your card. We&apos;ll come back to you with a final
        outline, availability and a secure payment link before confirming
        anything.
      </p>
    </form>
  );
}
