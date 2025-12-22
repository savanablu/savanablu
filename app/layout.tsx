import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Playfair_Display } from "next/font/google";
import ConditionalChatbot from "@/components/layout/ConditionalChatbot";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [
      { url: "/favicon.ico" },
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
          <ConditionalLayout>
            {children}
          </ConditionalLayout>

          <ConditionalChatbot />
        </CurrencyProvider>
      </body>
    </html>
  );
}
