"use client";

import { useMemo, useState } from "react";
import { parseISO, format } from "date-fns";
import { calculateBookingTotal } from "@/lib/booking/pricing";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/fx";
import { CountrySelector } from "@/components/contact/CountrySelector";

type BookingWidgetProps = {
  bookingType: "tour" | "package";
  itemSlug: string;
  itemTitle: string;
  basePrice: number; // USD per adult
  // Legacy props for backward compatibility
  tourSlug?: string;
  tourTitle?: string;
};

// 30% deposit
const DEPOSIT_RATE = 0.3;

export default function BookingWidget({
  bookingType,
  itemSlug,
  itemTitle,
  basePrice,
  tourSlug, // Legacy prop
  tourTitle, // Legacy prop
}: BookingWidgetProps) {
  // Use new props if provided, fall back to legacy props for backward compatibility
  const slug = itemSlug || tourSlug || "";
  const title = itemTitle || tourTitle || "";
  const isTour = bookingType === "tour";

  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countryCode, setCountryCode] = useState("+255"); // Default to Tanzania
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [flightDetails, setFlightDetails] = useState("");
  const [airportPickup, setAirportPickup] = useState(false);

  const [promoInput, setPromoInput] = useState("");
  const [discountUSD, setDiscountUSD] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const { currency, fx } = useCurrency();
  const [humanCheck, setHumanCheck] = useState(false);

  const displayDate =
    date && date.length === 10
      ? format(parseISO(date), "d MMM yyyy")
      : "Choose a date";

  // Base trip total in USD (before promo)
  const baseTotalUSD = useMemo(
    () => calculateBookingTotal(basePrice, adults, children),
    [basePrice, adults, children]
  );

  const finalTotalUSD = useMemo(() => {
    const total = baseTotalUSD - discountUSD;
    return total > 0 ? total : 0;
  }, [baseTotalUSD, discountUSD]);

  const depositUSD = useMemo(
    () => finalTotalUSD * DEPOSIT_RATE,
    [finalTotalUSD]
  );

  const balanceUSD = useMemo(
    () => finalTotalUSD - depositUSD,
    [finalTotalUSD, depositUSD]
  );

  const handleApplyPromo = async () => {
    const code = promoInput.trim();
    if (!code) {
      setPromoError("Please enter a promo code.");
      setPromoMessage(null);
      return;
    }

    if (baseTotalUSD <= 0) {
      setPromoError("Please select your party size first.");
      setPromoMessage(null);
      return;
    }

    setApplyingPromo(true);
    setPromoError(null);
    setPromoMessage(null);

    try {
      const res = await fetch("/api/promos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          amount: baseTotalUSD,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setDiscountUSD(0);
        setPromoError(
          data.error || "This promo code is not valid or no longer active."
        );
        setPromoMessage(null);
        return;
      }

      setDiscountUSD(data.discountAmount || 0);
      setPromoMessage(data.message || "Promo applied.");
      setPromoError(null);
    } catch (err) {
      console.error("Promo error:", err);
      setDiscountUSD(0);
      setPromoError("Something went wrong. Please try again.");
      setPromoMessage(null);
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleSubmitBooking = async () => {
    // Validate required fields
    if (!name.trim()) {
      alert("Please provide your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please provide your email address.");
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!date || !pickupLocation || !pickupTime) {
      alert("Please provide your preferred date, pick-up location, and pick-up time.");
      return;
    }

    if (airportPickup && !flightDetails.trim()) {
      alert("Flight details are required when airport pick-up is selected. Please provide your airline, flight number, and arrival time.");
      return;
    }

    const totalPeople = adults + children;

    const extendedNotes = [
      `Pick-up location: ${pickupLocation || "Not provided"}`,
      `Pick-up time: ${pickupTime || "Not provided"}`,
      `Airport pick-up required: ${airportPickup ? "Yes" : "No"}`,
      airportPickup
        ? `Flight details: ${flightDetails || "Not provided"}`
        : "Flight details: Not required (hotel/villa pick-up)",
      "",
      `Number of people: ${totalPeople} (${adults} adults, ${children} children)`,
      "",
      notes ? `Guest notes: ${notes}` : "Guest notes: None provided.",
    ].join("\n");

    const res = await fetch("/api/booking/create?returnJson=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: isTour ? "tour" : "package",
        slug,
        date,
        adults,
        children,
        promoCode: promoInput.trim(),
        customerName: name,
        customerEmail: email,
        customerPhone: phoneNumber.trim() ? `${countryCode}${phoneNumber.trim()}` : "",
        notes: extendedNotes,
      }),
    });

    const data = await res.json();
    if (res.ok && data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      alert(data.error || "Unable to create booking. Please try again.");
    }
  };

  return (
    <div className="space-y-3 text-xs text-sb-ink">
      <div>
        <h3 className="font-display text-sm text-sb-night">
          Request this experience
        </h3>
        <p className="mt-1 text-[0.78rem] text-sb-ink/70">
          Confirmation is shared by email or WhatsApp. Payment is typically arranged in Zanzibar, with an optional secure advance link available if you&apos;d like to hold your date.
        </p>
      </div>


      {/* Guest details */}
      <div className="mt-4 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sb-ink/70">
          Your details
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-[0.78rem] font-medium text-sb-ink/80">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-3 py-1.5 text-[0.78rem] outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[0.78rem] font-medium text-sb-ink/80">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                if (value.trim() && value.length > 0) {
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailPattern.test(value.trim())) {
                    setEmailError("Please enter a valid email address (e.g., name@example.com)");
                  } else {
                    setEmailError("");
                  }
                } else {
                  setEmailError("");
                }
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value && value.length > 0) {
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailPattern.test(value)) {
                    setEmailError("Please enter a valid email address (e.g., name@example.com)");
                  } else {
                    setEmailError("");
                  }
                }
              }}
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              title="Please enter a valid email address (e.g., name@example.com)"
              className={`w-full rounded-md border px-3 py-1.5 text-[0.78rem] outline-none focus:ring-1 ${
                emailError
                  ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-400"
                  : "border-sb-mist/80 bg-sb-shell/60 focus:border-sb-lagoon focus:ring-sb-lagoon/70"
              }`}
              required
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
        </div>
      </div>

      {/* Date & guests */}
      <div className="mt-4 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sb-ink/70">
          Date & guests
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <AvailabilityCalendar
            selectedDate={date}
            onChange={setDate}
          />
          <div className="space-y-1">
            <label className="block text-[0.78rem] font-medium text-sb-ink/80">
              Adults
            </label>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) =>
                setAdults(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-2 py-1.5 text-[0.78rem]"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[0.78rem] font-medium text-sb-ink/80">
              Children (&lt;12, 50% rate)
            </label>
            <input
              type="number"
              min={0}
              value={children}
              onChange={(e) =>
                setChildren(Math.max(0, Number(e.target.value) || 0))
              }
              className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-2 py-1.5 text-[0.78rem]"
            />
          </div>
        </div>
      </div>

      {/* Pickup & timing */}
      <div className="rounded-2xl bg-sb-foam/70 px-4 py-4 sm:px-5 sm:py-5 space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sb-ink/70">
            Pickup & timing
          </p>
          <p className="mt-1 text-[11px] text-sb-ink/70">
            These details help us plan the right vehicle and schedule for your day.
          </p>
        </div>

        {/* Airport checkbox first */}
        <div className="space-y-1">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-sb-ink/80">
            <input
              type="checkbox"
              checked={airportPickup}
              onChange={(e) => setAirportPickup(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-sb-ink/30 text-sb-deep focus:ring-sb-deep"
            />
            Airport pick-up required
          </label>
          <p className="text-[10px] text-sb-ink/55">
            Tick this if you&apos;d like us to collect you directly from the airport.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-sb-ink/80">
              Pick-up location (hotel, villa or airport)*
            </label>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Sogea, hotel name or Zanzibar Airport"
              className="w-full rounded-md border border-sb-ink/15 bg-white px-3 py-2 text-xs text-sb-ink placeholder:text-sb-ink/40 focus:border-sb-deep focus:outline-none focus:ring-1 focus:ring-sb-deep"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-sb-ink/80">
              Preferred pick-up time*
            </label>
            <input
              type="time"
              required
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full rounded-md border border-sb-ink/15 bg-white px-3 py-2 text-xs text-sb-ink focus:border-sb-deep focus:outline-none focus:ring-1 focus:ring-sb-deep"
            />
          </div>
        </div>

        {airportPickup && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-sb-ink/80">
              Flight details (required for airport pick-up)
            </label>
            <textarea
              rows={2}
              required={airportPickup}
              value={flightDetails}
              onChange={(e) => setFlightDetails(e.target.value)}
              placeholder="Airline, flight number, arrival time"
              className="w-full rounded-md border border-sb-ink/15 bg-white px-3 py-2 text-xs text-sb-ink placeholder:text-sb-ink/40 focus:border-sb-deep focus:outline-none focus:ring-1 focus:ring-sb-deep"
            />
            <p className="text-[10px] text-sb-ink/55">
              This helps us track delays and adjust timing on the day.
            </p>
          </div>
        )}
      </div>

      {/* Notes & promo */}
      <div className="mt-4 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sb-ink/70">
          Notes & promo
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[0.78rem] font-medium text-sb-ink/80">
              Notes / special requests
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hotel, pickup area, special occasions, pace you prefer…"
              className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-3 py-1.5 text-[0.78rem] outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
            />
          </div>

          <div className="space-y-1 rounded-xl bg-sb-shell/80 p-3">
            <label className="block text-[0.78rem] font-medium text-sb-ink/85">
              Promo code (if provided)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 rounded-md border border-sb-mist/80 bg-white px-3 py-1.5 text-[0.78rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={applyingPromo}
                className="rounded-full bg-sb-night px-3 py-1.5 text-[0.78rem] font-semibold text-sb-shell hover:bg-sb-ocean disabled:opacity-70"
              >
                {applyingPromo ? "Applying…" : "Apply"}
              </button>
            </div>
            {promoMessage && (
              <p className="mt-1 text-[0.78rem] text-emerald-700">
                {promoMessage}
              </p>
            )}
            {promoError && (
              <p className="mt-1 text-[0.78rem] text-red-600">{promoError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-4 rounded-xl bg-sb-shell/70 p-3 text-[0.85rem] text-sb-night">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-sb-ink/80">
          Estimated total
        </p>
        <p className="mt-1 text-[1.1rem] font-display">
          {formatPrice(finalTotalUSD, currency, fx)}
        </p>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-sb-ink/80">
          We&apos;ll confirm your booking by email or WhatsApp. Payment is normally made in Zanzibar, with an optional secure online advance link sent afterwards if you&apos;d like to lock in your date. We&apos;re flexible with gentle timing tweaks where tides and availability allow.
        </p>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <input
          id="human-check"
          type="checkbox"
          checked={humanCheck}
          onChange={(e) => setHumanCheck(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-sb-mist/80 text-sb-ocean focus:ring-sb-ocean"
        />
        <label
          htmlFor="human-check"
          className="text-[0.85rem] text-sb-ink/75"
        >
          I am not a robot (simple spam check)
        </label>
      </div>

      <p className="mt-2 text-[0.75rem] text-sb-ink/75">
        You&apos;ll receive a confirmation email from Savana Blu with all the
        details once your booking request is submitted.
      </p>

      <button
        type="button"
        onClick={handleSubmitBooking}
        disabled={!humanCheck}
        className="w-full rounded-full bg-sb-night px-4 py-2 text-[0.78rem] font-semibold text-sb-shell shadow-sm hover:bg-sb-ocean disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirm booking request
      </button>
    </div>
  );
}
