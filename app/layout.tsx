import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ChatbotWidget from "@/components/chat/ChatbotWidget";
import CookieConsent from "@/components/analytics/CookieConsent";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://savanablu.com"),
  title: {
    default:
      "Savana Blu Luxury Expeditions | Boutique Safaris & Ocean Escapes",
    template: "%s | Savana Blu Luxury Expeditions",
  },
  description:
    "Boutique, small-group and private tours in Zanzibar – from Safari Blue and Mnemba reef to Stone Town, spice farms and sunset dhow cruises.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://savanablu.com",
    title: "Savana Blu Luxury Expeditions | Boutique Safaris & Ocean Escapes",
    description:
      "Boutique, small-group and private tours in Zanzibar – curated by a locally based team for guests who prefer fewer people and more depth.",
    siteName: "Savana Blu Luxury Expeditions",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Savana Blu Luxury Expeditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Savana Blu Luxury Expeditions | Boutique Safaris & Ocean Escapes",
    description:
      "Boutique, small-group and private tours in Zanzibar – curated by a locally based team for guests who prefer fewer people and more depth.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${display.variable} font-sans min-h-screen bg-sb-shell text-sb-ink antialiased flex flex-col`}
      >
        <CurrencyProvider>
          <Header />

          <main className="flex-1 bg-sb-shell pt-16">{children}</main>

          <ChatbotWidget />
          <WhatsAppButton />
          <CookieConsent />

          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
