"use client";

import { useState, useEffect, useRef } from "react";

const WHATSAPP_NUMBER = "+255678439529"; // Admin WhatsApp number

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi Savana Blu, I'd like some help planning my Zanzibar trip."
);

const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_MESSAGE}`;

const SUGGESTED_QUESTIONS = [
  "Hi, I'm planning a trip to Zanzibar",
  "We're a couple on honeymoon",
  "We're a family with children",
  "How does pricing work?",
  "How do payments work?",
  "Where is pickup from?",
  "What about cancellations?",
  "Can we make a private tour?",
];

function getAnswer(question: string): string {
  const q = question.toLowerCase();

  // Casual greetings / how are you
  if (
    q.includes("how are you") ||
    q.includes("how's it going") ||
    q.includes("how do you do") ||
    (q.includes("how") && q.includes("you"))
  ) {
    return (
      "I'm doing well, thank you! Ready to help you plan your Zanzibar adventure. " +
      "What would you like to know about our tours?"
    );
  }

  // Greeting / general planning
  if (
    q.includes("hi") ||
    q.includes("hello") ||
    q.includes("jambo") ||
    q.includes("planning a trip") ||
    q.includes("plan a trip")
  ) {
    return (
      "Jambo! When are you thinking of travelling, and how many nights do you have? " +
      "Are you more drawn to the ocean, the culture, or a mix of both?"
    );
  }

  // Honeymoon tone
  if (q.includes("honeymoon") || q.includes("romantic") || q.includes("couple")) {
    return (
      "How lovely – Zanzibar is perfect for a honeymoon. " +
      "When are you travelling? And what matters more to you – quiet beaches, cultural experiences, or ocean activities?"
    );
  }

  // Families
  if (q.includes("family") || q.includes("children") || q.includes("kids")) {
    return (
      "We design relaxed, family-friendly days. " +
      "How old are your children, and how confident are they in the water? That helps us suggest the right tours."
    );
  }

  // Pricing
  if (q.includes("price") || q.includes("pricing") || q.includes("cost")) {
    return (
      "Tours are priced per adult, with children under 12 at 50% off. " +
      "Which tours interest you, and are you thinking shared or private? I can give you a clear quote."
    );
  }

  // Payments
  if (q.includes("payment") || q.includes("pay") || q.includes("card")) {
    return (
      "We accept secure online payments via Ziina in US dollars – you'll see the full amount before confirming. " +
      "Bank transfers work too. Which method do you prefer?"
    );
  }

  // Pickups
  if (q.includes("pickup") || q.includes("pick up") || q.includes("transfer")) {
    return (
      "We collect you from your accommodation in Zanzibar. " +
      "Where are you staying – Stone Town, north coast, or east/south coast? That helps us give you exact pickup times."
    );
  }

  // Cancellations / changes
  if (
    q.includes("cancel") ||
    q.includes("cancellation") ||
    q.includes("change") ||
    q.includes("amend")
  ) {
    return (
      "If you need to adjust your date or pick-up time, let us know as early as possible and we'll do our best to accommodate changes around tides, flights and availability. " +
      "However, if you cancel your trip, the 20% advance payment is non-refundable as we've already committed guides, boats and vehicles. Is there something specific you're concerned about?"
    );
  }

  // Private tours
  if (q.includes("private") || q.includes("exclusive")) {
    return (
      "Yes, most experiences can be private. " +
      "Which tours interest you, and how many in your group? I can quote both shared and private options."
    );
  }

  // Tour recommendation
  if (q.includes("which tour") || q.includes("recommend") || q.includes("suggest")) {
    return (
      "For a first visit, we suggest: Stone Town walk, one ocean day (Safari Blue or Mnemba), and spice farms with Jozani Forest. " +
      "How many days do you have? And what draws you most – beaches, culture, or ocean?"
    );
  }

  // Best time to visit / weather
  if (
    q.includes("best time") ||
    q.includes("when to visit") ||
    q.includes("weather") ||
    q.includes("rainy season") ||
    q.includes("dry season")
  ) {
    return (
      "The best time is June–October (dry season) and December–February. " +
      "When are you thinking of travelling? I can suggest tours that work well for that time."
    );
  }

  // Safety / is it safe
  if (q.includes("safe") || q.includes("safety") || q.includes("dangerous")) {
    return (
      "Zanzibar is generally very safe for travelers. " +
      "Our tours are led by experienced local guides. Is there something specific you're concerned about?"
    );
  }

  // Visa / passport
  if (q.includes("visa") || q.includes("passport") || q.includes("entry requirement")) {
    return (
      "Most visitors need a visa (available on arrival or online). " +
      "Your passport should be valid for 6+ months. Which country are you traveling from?"
    );
  }

  // Currency / money
  if (
    q.includes("currency") ||
    q.includes("money") ||
    q.includes("cash") ||
    q.includes("dollar") ||
    q.includes("shilling")
  ) {
    return (
      "We accept US dollars (preferred) and Tanzanian shillings. " +
      "Card payments work for bookings; cash is useful for local markets. Do you prefer card or cash?"
    );
  }

  // Language / do they speak English
  if (q.includes("language") || q.includes("english") || q.includes("speak")) {
    return (
      "Yes, English is widely spoken, especially in tourist areas. " +
      "Our guides speak excellent English. Are you comfortable with English, or do you need another language?"
    );
  }

  // Food / dietary requirements
  if (
    q.includes("food") ||
    q.includes("diet") ||
    q.includes("vegetarian") ||
    q.includes("vegan") ||
    q.includes("halal") ||
    q.includes("allergy")
  ) {
    return (
      "Most tours include lunch. We can accommodate dietary needs – vegetarian, vegan, halal, allergies. " +
      "What dietary requirements do you have? We'll make sure you're well taken care of."
    );
  }

  // What to pack / what to bring
  if (q.includes("pack") || q.includes("bring") || q.includes("what to wear")) {
    return (
      "Light clothing, swimwear, sunscreen, hat, and comfortable shoes. " +
      "Which tours are you interested in? I can give you a specific packing list."
    );
  }

  // Duration / how long
  if (
    q.includes("how long") ||
    q.includes("duration") ||
    q.includes("hours") ||
    q.includes("days")
  ) {
    return (
      "Most day tours are 6–8 hours. Multi-day packages vary. " +
      "Which tour are you curious about? I can give you exact timings."
    );
  }

  // What's included
  if (q.includes("included") || q.includes("what's included") || q.includes("include")) {
    return (
      "Usually: transport, guide, lunch, and activities. " +
      "Which tour are you looking at? I can give you the exact inclusions."
    );
  }

  // Group size
  if (q.includes("group size") || q.includes("how many people") || q.includes("crowded")) {
    return (
      "We keep groups small – usually 2–10 guests. " +
      "Prefer even more space? Private tours are available. How many are in your group?"
    );
  }

  // Age restrictions
  if (q.includes("age") || q.includes("children") || q.includes("kids") || q.includes("elderly")) {
    return (
      "Most tours welcome all ages. Some ocean activities have age recommendations. " +
      "What ages are in your group? I can suggest the best options."
    );
  }

  // Swimming / snorkeling
  if (
    q.includes("swim") ||
    q.includes("snorkel") ||
    q.includes("diving") ||
    q.includes("water") ||
    q.includes("ocean")
  ) {
    return (
      "Swimming ability varies by tour. Snorkeling is optional on most ocean tours. " +
      "How confident are you in the water? I can recommend tours that match your comfort level."
    );
  }

  // Transportation / getting around
  if (
    q.includes("transport") ||
    q.includes("getting around") ||
    q.includes("taxi") ||
    q.includes("car")
  ) {
    return (
      "We include transport for all tours. " +
      "For getting around independently, taxis and local transport are available. Where are you staying?"
    );
  }

  // Photography
  if (q.includes("photo") || q.includes("camera") || q.includes("picture")) {
    return (
      "Photography is welcome on all tours. " +
      "Some places may have small fees for cameras. Which tours are you most excited to photograph?"
    );
  }

  // Tipping
  if (q.includes("tip") || q.includes("tipping") || q.includes("gratuity")) {
    return (
      "Tipping is appreciated but not required. " +
      "If you're happy with the service, 10–15% is a nice gesture. Is there anything else about the tours you'd like to know?"
    );
  }

  // Thank you / thanks
  if (q.includes("thank") || q.includes("thanks")) {
    return (
      "You're very welcome! " +
      "Is there anything else I can help you with about your Zanzibar trip?"
    );
  }

  // Goodbye / bye
  if (q.includes("bye") || q.includes("goodbye") || q.includes("see you")) {
    return (
      "Karibu tena – you're welcome back anytime! " +
      "Feel free to reach out if you have more questions. Safe travels!"
    );
  }

  // What to see / attractions / things to do
  if (
    q.includes("what to see") ||
    q.includes("attractions") ||
    q.includes("things to do") ||
    q.includes("must see") ||
    q.includes("places to visit")
  ) {
    return (
      "Top experiences: Stone Town (UNESCO World Heritage), Safari Blue or Mnemba reef, spice farms, Jozani Forest, and beautiful beaches. " +
      "What interests you most – history, nature, or ocean activities?"
    );
  }

  // Beaches / best beaches
  if (q.includes("beach") || q.includes("beaches") || q.includes("best beach")) {
    return (
      "Popular beaches: Paje, Jambiani, Nungwi, and Kendwa. Each has its own character. " +
      "Are you looking for quiet and secluded, or more activity and water sports?"
    );
  }

  // Nightlife / evening activities
  if (
    q.includes("nightlife") ||
    q.includes("evening") ||
    q.includes("night") ||
    q.includes("dinner") ||
    q.includes("restaurant")
  ) {
    return (
      "Stone Town has lovely evening walks and rooftop restaurants. " +
      "Are you interested in sunset dhow cruises, cultural shows, or quiet dinners? I can suggest evening activities."
    );
  }

  // Shopping / markets / souvenirs
  if (
    q.includes("shop") ||
    q.includes("market") ||
    q.includes("souvenir") ||
    q.includes("buy")
  ) {
    return (
      "Stone Town has great markets for spices, crafts, and local art. " +
      "What are you looking to buy? I can point you to the best spots."
    );
  }

  // Internet / WiFi
  if (q.includes("wifi") || q.includes("internet") || q.includes("connection")) {
    return (
      "Most hotels have WiFi. Coverage can vary on tours, especially ocean days. " +
      "Are you staying connected for work, or happy to disconnect?"
    );
  }

  // Electricity / plugs
  if (q.includes("plug") || q.includes("adapter") || q.includes("electricity") || q.includes("voltage")) {
    return (
      "Zanzibar uses Type D and G plugs, 230V. " +
      "Most hotels have adapters, but bringing your own is wise. Where are you traveling from?"
    );
  }

  // Time zone
  if (q.includes("time zone") || q.includes("timezone") || q.includes("gmt")) {
    return (
      "Zanzibar is GMT+3 (East Africa Time). " +
      "Our working hours are 09:00–18:00 local time. What time zone are you in?"
    );
  }

  // Health / vaccinations / malaria
  if (
    q.includes("vaccination") ||
    q.includes("vaccine") ||
    q.includes("malaria") ||
    q.includes("health") ||
    q.includes("medical")
  ) {
    return (
      "Malaria prophylaxis is recommended. Yellow fever may be required depending on your route. " +
      "Please consult your doctor or travel clinic. Are you coming from a yellow fever area?"
    );
  }

  // Insurance / travel insurance
  if (q.includes("insurance") || q.includes("cover")) {
    return (
      "We recommend comprehensive travel insurance covering medical, cancellation, and activities. " +
      "Do you already have insurance, or need recommendations?"
    );
  }

  // Booking process / how to book
  if (q.includes("how to book") || q.includes("book") || q.includes("reserve")) {
    return (
      "You can book directly on our website with secure payment, or contact us via WhatsApp for personalized planning. " +
      "Which tours are you interested in? I can guide you through the booking process."
    );
  }

  // Confirmation / booking confirmation
  if (q.includes("confirmation") || q.includes("confirm")) {
    return (
      "You'll receive email confirmation with all details: tour times, pickup info, and what's included. " +
      "Have you already booked, or are you planning to?"
    );
  }

  // Refund policy
  if (q.includes("refund") || q.includes("money back")) {
    return (
      "If you cancel your trip, the 20% advance payment is non-refundable as we've already committed guides, boats and vehicles in advance. " +
      "If you need to adjust your date or timing, we're flexible where tides, flights and availability allow. What's your situation? We'll work with you to find the best solution."
    );
  }

  // Availability / last minute / early booking
  if (
    q.includes("available") ||
    q.includes("last minute") ||
    q.includes("short notice") ||
    q.includes("advance booking")
  ) {
    return (
      "Availability varies. We recommend booking a few days ahead, especially in peak season. " +
      "When are you traveling? I can check what's possible for your dates."
    );
  }

  // Solo travel
  if (q.includes("solo") || q.includes("alone") || q.includes("single")) {
    return (
      "Solo travelers are very welcome. Our small groups are perfect for meeting people. " +
      "Are you comfortable joining a small group, or would you prefer a private tour?"
    );
  }

  // LGBTQ+ friendly
  if (q.includes("lgbt") || q.includes("gay") || q.includes("lgbtq")) {
    return (
      "Zanzibar welcomes all travelers. We treat everyone with respect and care. " +
      "Is there anything specific you'd like to know about your stay?"
    );
  }

  // Accessibility / wheelchair / mobility
  if (
    q.includes("wheelchair") ||
    q.includes("accessible") ||
    q.includes("mobility") ||
    q.includes("disability")
  ) {
    return (
      "Some tours are more accessible than others. Stone Town has uneven streets; ocean tours require boat access. " +
      "What mobility needs do you have? We can suggest the best options."
    );
  }

  // Local customs / culture / etiquette
  if (
    q.includes("custom") ||
    q.includes("culture") ||
    q.includes("etiquette") ||
    q.includes("dress code") ||
    q.includes("appropriate")
  ) {
    return (
      "Modest dress is appreciated, especially in Stone Town and villages. " +
      "Are you planning to visit mosques or local communities? I can give you specific guidance."
    );
  }

  // What to expect
  if (q.includes("what to expect") || q.includes("expect")) {
    return (
      "Expect warm hospitality, beautiful scenery, and authentic experiences. " +
      "Which tour are you curious about? I can walk you through what a typical day looks like."
    );
  }

  // Reviews / ratings / feedback
  if (q.includes("review") || q.includes("rating") || q.includes("feedback")) {
    return (
      "We're proud of our guest feedback. You can see reviews on our website. " +
      "Have you read any reviews, or would you like to know what guests love most?"
    );
  }

  // Why choose you / what makes you different
  if (
    q.includes("why") ||
    q.includes("different") ||
    q.includes("unique") ||
    q.includes("special")
  ) {
    return (
      "We keep groups small, work with a close circle of trusted local guides and crews, and focus on authentic experiences. " +
      "What matters most to you – group size, local connections, or personalized service?"
    );
  }

  // Custom itineraries
  if (
    q.includes("custom") ||
    q.includes("tailor") ||
    q.includes("bespoke") ||
    q.includes("personalized")
  ) {
    return (
      "Absolutely – we love creating custom itineraries. " +
      "What's your ideal Zanzibar experience? Share your interests and we'll design something special."
    );
  }

  // Hotel recommendations / where to stay
  if (
    q.includes("hotel") ||
    q.includes("where to stay") ||
    q.includes("accommodation") ||
    q.includes("resort")
  ) {
    return (
      "We can suggest hotels based on your preferences and budget. " +
      "Are you looking for beachfront, Stone Town, or something specific? What's your budget range?"
    );
  }

  // Airport transfers
  if (q.includes("airport") || q.includes("transfer from airport")) {
    return (
      "We can arrange airport transfers. It's about 20–30 minutes to Stone Town, 45–60 minutes to north coast. " +
      "Which airport are you flying into, and where are you staying?"
    );
  }

  // Internal flights / domestic flights
  if (q.includes("flight") || q.includes("flying")) {
    return (
      "Zanzibar has an international airport. Internal flights connect to mainland Tanzania. " +
      "Are you coming from Dar es Salaam, or flying internationally?"
    );
  }

  // Ferry / boat transfers
  if (q.includes("ferry") || q.includes("boat from dar")) {
    return (
      "There's a ferry from Dar es Salaam to Zanzibar (about 2 hours). " +
      "Are you planning to take the ferry? I can help with timing and connections."
    );
  }

  // Experience level / skill required
  if (
    q.includes("experience") ||
    q.includes("skill") ||
    q.includes("beginner") ||
    q.includes("advanced")
  ) {
    return (
      "Most tours are suitable for all levels. Some ocean activities are optional. " +
      "What's your experience with water activities? I can match tours to your comfort level."
    );
  }

  // Physical fitness
  if (q.includes("fitness") || q.includes("physical") || q.includes("walking")) {
    return (
      "Tours vary in activity level. Stone Town walks are gentle; ocean days are mostly relaxing. " +
      "What's your fitness level? I can suggest tours that match your comfort."
    );
  }

  // Rain / weather backup
  if (q.includes("rain") || q.includes("weather") || q.includes("backup")) {
    return (
      "We have backup plans for rainy days. Some tours can be adjusted or rescheduled. " +
      "What tours are you interested in? I can explain our weather policies."
    );
  }

  // Emergency contacts
  if (q.includes("emergency") || q.includes("contact number")) {
    return (
      "You'll receive local contact numbers with your booking confirmation. " +
      "Our team is available during tours. Are you concerned about something specific?"
    );
  }

  // Fallback when the bot is out of depth
  return (
    "I can help with pricing, payments, pickups, cancellations, and tour options. " +
    "For detailed planning or specific questions, our Zanzibar-based team can help via WhatsApp. What else can I clarify?"
  );
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Auto-scroll to bottom when new messages are added or panel opens
  useEffect(() => {
    if (scrollContainerRef.current && (lastQuestion || lastAnswer || isOpen)) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [lastQuestion, lastAnswer, isOpen]);

  const handleAsk = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answer = getAnswer(trimmed);
    setLastQuestion(trimmed);
    setLastAnswer(answer);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAsk(input);
    setInput("");
  };

  return (
    <div className="hidden md:block">
      {/* Toggle button */}
      {!isOpen && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sb-night text-sm font-medium text-sb-shell shadow-lg shadow-black/20 hover:bg-sb-ocean focus:outline-none focus:ring-2 focus:ring-sb-ocean/80 focus:ring-offset-2 focus:ring-offset-sb-shell"
          aria-label="Open Savana Blu concierge chatbot"
        >
          💬
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-4 top-20 z-40 flex w-80 max-w-[90vw] flex-col rounded-2xl border border-sb-mist/90 bg-white/95 p-3 text-[0.78rem] text-sb-ink shadow-xl backdrop-blur-sm"
        >
          <div className="mb-2 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[0.78rem] uppercase tracking-[0.08em] text-sb-ink/60">
                  Zanzibar trip concierge
                </p>
                <p className="text-sm font-medium text-sb-night">
                  Savana Blu assistant
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sb-mist/40 text-[0.78rem] text-sb-ink/80 hover:bg-sb-mist/70"
                aria-label="Close chatbot"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-[0.78rem] text-sb-ink/70">
              Ask about tours, pricing, pickups or what might suit your trip. Tap a
              question below or type your own.
            </p>
          </div>

          {/* Scrollable content */}
          <div ref={scrollContainerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto">
            {/* Suggested questions */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleAsk(q)}
                    className="rounded-full bg-sb-mist/40 px-2 py-1 text-[0.78rem] text-sb-ink/80 hover:bg-sb-mist/70"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation-style answer */}
            <div className="rounded-lg bg-sb-mist/20 p-2">
              {lastQuestion ? (
                <>
                  <p className="text-[0.78rem] text-sb-ink/80">
                    <span className="font-semibold text-sb-night">You:</span>{" "}
                    {lastQuestion}
                  </p>
                  <p className="mt-2 text-[0.78rem] text-sb-ink/85">
                    <span className="font-semibold text-sb-night">
                      Savana Blu concierge:
                    </span>{" "}
                    {lastAnswer}
                  </p>
                </>
              ) : (
                <p className="text-[0.78rem] text-sb-ink/75">
                  Tap one of the questions above or type your own to see helpful
                  information about our tours and services.
                </p>
              )}
            </div>
          </div>

          {/* Fixed bottom section */}
          <div className="shrink-0 space-y-3 border-t border-sb-mist/60 pt-3">
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                name="message"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                className="flex-1 rounded-full border border-sb-mist/80 bg-sb-shell/70 px-3 py-1.5 text-[0.85rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/60"
              />
              <button
                type="submit"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sb-ocean text-[0.78rem] font-semibold text-sb-shell hover:bg-sb-lagoon"
              >
                ↗
              </button>
            </form>

            <div className="text-[0.68rem] text-sb-ink/65">
              <p>
                Based in Zanzibar (GMT+3), working hours 09:00–18:00. For a fully
                tailored plan, you can{" "}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sb-ocean underline-offset-2 hover:underline"
                >
                  chat with our team on WhatsApp
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
