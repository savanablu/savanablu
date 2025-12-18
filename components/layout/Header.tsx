"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CurrencySelector } from "@/components/fx/CurrencySelector";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/zanzibar-tours", label: "Zanzibar Tours" },
  { href: "/safaris", label: "Safaris" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Hide currency selector on homepage and info pages
  const hideCurrency = 
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/faq" ||
    pathname === "/contact";

  const toggleMobile = () => setMobileOpen((open) => !open);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-sb-mist/30 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={closeMobile}
        >
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/images/logo-header.png"
              alt="Savana Blu"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm text-sb-night">
              Savana Blu
            </span>
            <span className="text-[0.78rem] text-sb-ink/70">
              Boutique Safaris & Ocean Escapes
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-[0.9rem] text-sb-ink/80 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-1.5 transition-all duration-200 ${
                  active
                    ? "font-semibold text-sb-night"
                    : "hover:bg-sb-mist/40 hover:text-sb-night"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-sb-ocean" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA and Currency */}
        <div className="hidden items-center gap-3 md:flex">
          {!hideCurrency && <CurrencySelector variant="desktop" />}
          <Link
            href="/contact"
            className="rounded-full bg-sb-night px-4 py-2 text-[0.9rem] font-semibold text-sb-shell shadow-sm transition-all duration-200 hover:bg-sb-ocean hover:shadow-md"
          >
            Enquire
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={toggleMobile}
          className="inline-flex items-center justify-center rounded-full border border-sb-mist/80 bg-white/90 p-2 text-sb-night shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <svg
            className={`h-4 w-4 transition-transform ${
              mobileOpen ? "rotate-90" : ""
            }`}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="border-t border-sb-mist/50 bg-white/80 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-[0.9rem] text-sb-ink/90">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`relative rounded-xl px-3 py-2 transition-all duration-200 ${
                    active
                      ? "bg-white font-semibold text-sb-night shadow-sm"
                      : "hover:bg-white/80 hover:text-sb-night"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sb-ocean" />
                  )}
                </Link>
              );
            })}

            <div className="mt-3 space-y-2 border-t border-sb-mist/60 pt-3">
              {!hideCurrency && (
                <CurrencySelector
                  variant="mobile"
                  className="w-full"
                  onChange={closeMobile}
                />
              )}
              <Link
                href="/contact"
                onClick={closeMobile}
                className="flex w-full items-center justify-center rounded-full bg-sb-night px-4 py-2 text-[0.85rem] font-semibold text-sb-shell shadow-sm transition-all duration-200 hover:bg-sb-ocean hover:shadow-md"
              >
                Enquire
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
