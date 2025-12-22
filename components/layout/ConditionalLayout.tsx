"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CookieConsent from "@/components/analytics/CookieConsent";

type ConditionalLayoutProps = {
  children: React.ReactNode;
};

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    // Admin pages don't get Header/Footer/WhatsApp/CookieConsent
    // Admin pages have their own main tag, so just return children
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-sb-shell pt-16">{children}</main>
      <WhatsAppButton />
      <CookieConsent />
      <Footer />
    </>
  );
}

