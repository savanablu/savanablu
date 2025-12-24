"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CountrySelector } from "./CountrySelector";

export default function ContactForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");
  const [company, setCompany] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [countryCode, setCountryCode] = useState("+255"); // Default to Tanzania
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Generate random math question
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    return { num1, num2, answer: num1 + num2 };
  };
  
  // Initialize with null to avoid hydration mismatch, then generate on client
  const [mathQuestion, setMathQuestion] = useState<{ num1: number; num2: number; answer: number } | null>(null);
  
  // Generate question only on client side to avoid hydration mismatch
  useEffect(() => {
    setMathQuestion(generateQuestion());
  }, []);

  // Get tomorrow's date in YYYY-MM-DD format for min date (future dates only)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Validate phone number - only allow digits
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    const cleaned = value.replace(/\D/g, "");
    setPhoneNumber(cleaned);
  };

  // Validate captcha - only allow digits
  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (/^\d*$/.test(value)) {
      setCaptcha(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString().trim() || "";
        
        // Validate email format client-side
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailPattern.test(email)) {
          setEmailError("Please enter a valid email address (e.g., name@example.com)");
          setError("Please enter a valid email address.");
          setSubmitting(false);
          return;
        }
        
        // Clear email error if valid
        if (email && emailPattern.test(email)) {
          setEmailError("");
        }

    // Combine country code with phone number
    const fullPhone = phoneNumber.trim() ? `${countryCode}${phoneNumber.trim()}` : "";
    
    // Validate required fields
    if (!phoneNumber.trim()) {
      setError("WhatsApp number is required.");
      setSubmitting(false);
      return;
    }

    if (!mathQuestion) {
      setError("Please wait for the question to load.");
      setSubmitting(false);
      return;
    }

    const payload = {
      name: formData.get("name")?.toString().trim() || "",
      email: email,
      phone: fullPhone,
      preferredTour: formData.get("preferredTour")?.toString().trim() || "",
      dates: formData.get("dates")?.toString().trim() || "",
      accommodation: formData.get("accommodation")?.toString().trim() || "",
      message: formData.get("message")?.toString().trim() || "",
      company: company,
      captchaAnswer: captcha,
      captchaQuestion: `${mathQuestion.num1} + ${mathQuestion.num2}`,
      captchaExpectedAnswer: mathQuestion.answer,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if response is JSON before parsing
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response from API:", text.substring(0, 500));
        // Try to extract error message from HTML if it's an error page
        const errorMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i) || 
                          text.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                          text.match(/Error: ([^<]+)/i);
        const errorMsg = errorMatch ? errorMatch[1] : "Server returned an error. Please check the browser console (F12) for details.";
        throw new Error(errorMsg);
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error === "Invalid captcha answer.") {
          // Generate new question on error
          setMathQuestion(generateQuestion());
          setCaptcha("");
          throw new Error("The answer to the quick check was not correct. Please try again with the new question.");
        }
        throw new Error(data.error || "Something went wrong. Please try again in a moment.");
      }

      // Reset form state before redirecting
      setSubmitting(false);
      setCompany("");
      setCaptcha("");
      setPhoneNumber("");
      setMathQuestion(generateQuestion()); // Generate new question
      if (formRef.current) {
        formRef.current.reset();
      }
      
      router.push("/contact?status=success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-sb-mist bg-sb-shell/60 px-3 py-2 text-[0.9rem] text-sb-night outline-none focus:border-sb-ocean"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            onChange={(e) => {
              const value = e.target.value;
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
            className={`mt-1 w-full rounded-xl border px-3 py-2 text-[0.9rem] text-sb-night outline-none ${
              emailError
                ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                : "border-sb-mist bg-sb-shell/60 focus:border-sb-ocean"
            }`}
            placeholder="you@example.com"
            title="Please enter a valid email address (e.g., name@example.com)"
          />
          {emailError && (
            <p className="mt-1 text-[0.75rem] text-red-600">{emailError}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
            WhatsApp number <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex">
            <CountrySelector
              value={countryCode}
              onChange={setCountryCode}
            />
            <input
              type="tel"
              required
              inputMode="numeric"
              pattern="\d+"
              value={phoneNumber}
              onChange={handlePhoneInput}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = (e.clipboardData || (window as any).clipboardData).getData("text");
                const cleaned = pasted.replace(/\D/g, "");
                setPhoneNumber(cleaned);
              }}
              className="flex-1 rounded-r-xl border border-l-0 border-sb-mist bg-sb-shell/60 px-3 py-2 text-[0.9rem] text-sb-night outline-none focus:border-sb-ocean focus:bg-sb-shell/80"
              placeholder="123456789"
            />
          </div>
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
            Preferred experience or safari
          </label>
          <input
            name="preferredTour"
            type="text"
            className="mt-1 w-full rounded-xl border border-sb-mist bg-sb-shell/60 px-3 py-2 text-[0.9rem] text-sb-night outline-none focus:border-sb-ocean"
            placeholder="Safari Blue, Mnemba, Stone Town, etc."
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
            Travel dates
          </label>
          <input
            name="dates"
            type="date"
            min={minDate}
            className="mt-1 w-full rounded-xl border border-sb-mist bg-sb-shell/60 px-3 py-2 text-[0.9rem] text-sb-night outline-none focus:border-sb-ocean"
          />
        </div>
        <div>
          <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
            Where you&apos;ll stay
          </label>
          <input
            name="accommodation"
            type="text"
            className="mt-1 w-full rounded-xl border border-sb-mist bg-sb-shell/60 px-3 py-2 text-[0.9rem] text-sb-night outline-none focus:border-sb-ocean"
            placeholder="Hotel / villa (if known)"
          />
        </div>
      </div>

      <div>
        <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
          Tell us a little about your plans
        </label>
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-xl border border-sb-mist bg-sb-shell/60 px-3 py-2 text-[0.9rem] text-sb-night outline-none focus:border-sb-ocean"
          placeholder="Who you're travelling with, what you enjoy (quiet beaches, snorkelling, markets, history, etc.)."
        />
      </div>

      {/* Honeypot field */}
      <div className="hidden">
        <label>
          Company (leave this field empty)
        </label>
        <input
          type="text"
          name="company"
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Simple math captcha */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">
            Quick check (are you human?) <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setMathQuestion(generateQuestion());
              setCaptcha("");
            }}
            className="text-[0.75rem] text-sb-ocean hover:text-sb-night underline"
            title="Get a new question"
          >
            New question
          </button>
        </div>
        <p className="mt-1 text-[0.78rem] text-sb-ink/70">
              What is {mathQuestion ? `${mathQuestion.num1} + ${mathQuestion.num2}` : "..."}?
        </p>
        <input
          type="text"
          name="captcha"
          inputMode="numeric"
          pattern="\d+"
          autoComplete="off"
          className="mt-1 w-full rounded-xl border border-sb-mist bg-sb-shell/60 px-3 py-2 text-[0.9rem] text-sb-night outline-none focus:border-sb-ocean"
          value={captcha}
          onChange={handleCaptchaChange}
          onKeyDown={(e) => {
            // Allow: backspace, delete, tab, escape, enter, home, end, arrow keys
            if (
              [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
              // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
              (e.keyCode === 65 && e.ctrlKey === true) ||
              (e.keyCode === 67 && e.ctrlKey === true) ||
              (e.keyCode === 86 && e.ctrlKey === true) ||
              (e.keyCode === 88 && e.ctrlKey === true) ||
              // Allow only digits
              /^\d$/.test(e.key)
            ) {
              return;
            }
            e.preventDefault();
          }}
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full bg-sb-night px-5 py-2 text-[0.9rem] font-semibold text-sb-shell hover:bg-sb-ocean disabled:opacity-70"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
        <p className="text-[0.78rem] text-sb-ink/65">
          We usually reply within a few working hours. For very last–minute
          plans, WhatsApp is often quickest.
        </p>
      </div>
    </form>
  );
}
