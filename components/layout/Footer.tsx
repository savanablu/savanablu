import Link from "next/link";
import Image from "next/image";
import TripAdvisorRated from "@/components/ui/TripAdvisorRated";

const navItems = [
  { href: "/zanzibar-tours", label: "Zanzibar Tours" },
  { href: "/safaris", label: "Safaris" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sb-mist/70 bg-sb-shell/95">
      <div className="container-page py-10 md:py-12">
        <div className="grid gap-8 text-sm text-sb-ink/80 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-footer.png"
                alt="Savana Blu Luxury Expeditions"
                width={250}
                height={80}
                className="h-auto w-auto max-w-[250px]"
              />
            </Link>
            <p className="text-[0.9rem] leading-relaxed text-sb-ink/75">
              Boutique, small-group and private tours thoughtfully crafted on
              the islands and coast of Zanzibar.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-sb-ink/60 uppercase">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[0.9rem] text-sb-ink/75 transition-colors duration-200 hover:text-sb-ocean hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-sb-ink/60 uppercase">
              Contact
            </h4>
            <div className="space-y-1.5 text-[0.9rem] leading-relaxed text-sb-ink/75">
              <p>
                Email:{" "}
                <a
                  href="mailto:hello@savanablu.com"
                  className="font-medium text-sb-lagoon transition-colors duration-200 hover:text-sb-ocean hover:underline"
                >
                  hello@savanablu.com
                </a>
              </p>
              <p>Sogea, Zanzibar, Tanzania</p>
            </div>
            <nav className="mt-4 flex flex-col gap-2 border-t border-sb-mist/50 pt-3">
              <Link
                href="/privacy"
                className="text-[0.85rem] text-sb-ink/70 transition-colors duration-200 hover:text-sb-ocean hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[0.85rem] text-sb-ink/70 transition-colors duration-200 hover:text-sb-ocean hover:underline"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-sb-ink/60 uppercase">
              Ethos
            </h4>
            <p className="text-[0.9rem] leading-relaxed text-sb-ink/75">
              Intimate group sizes, genuine local hosts and unhurried itineraries
              that honour the rhythm of the Swahili coast.
            </p>
            <div className="mt-4 flex justify-center">
              <TripAdvisorRated showText={false} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-sb-mist/60 pt-6 text-xs text-sb-ink/60 sm:flex-row sm:items-center">
          <p className="text-[0.85rem]">© {year} Savana Blu Luxury Expeditions. All rights reserved.</p>
          <p className="text-[0.85rem] italic text-sb-ink/70">Crafted with care on the shores of Zanzibar.</p>
        </div>
      </div>
    </footer>
  );
}
