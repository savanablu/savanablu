import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Savana Blu",
  description: "Admin dashboard for Savana Blu",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout min-h-screen bg-sb-deep" style={{ 
      WebkitTextSizeAdjust: '100%',
      MozTextSizeAdjust: '100%',
      msTextSizeAdjust: '100%',
      textSizeAdjust: '100%',
    }}>
      {children}
    </div>
  );
}

