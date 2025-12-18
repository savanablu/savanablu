import Section from "@/components/ui/Section";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

type PageProps = {
  searchParams: { from?: string };
};

export default function AdminLoginPage({ searchParams }: PageProps) {
  const from = searchParams.from || "";
  const redirectTo =
    from && from.startsWith("/admin/") ? from : "/admin";

  return (
    <Section className="pb-16 pt-10">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="font-display text-2xl text-sb-night">
          Savana Blu admin
        </h1>
        <p className="text-sm text-sb-ink/80">
          This area is for the Savana Blu team only. Please enter the admin
          passcode to view bookings, finance and CRM tools.
        </p>

        <AdminLoginForm redirectTo={redirectTo} />

        <p className="text-[0.7rem] text-sb-ink/60">
          If you&apos;ve forgotten the passcode, update the{" "}
          <code>ADMIN_PASSCODE</code> value in your{" "}
          <code>.env.local</code> file and restart the site.
        </p>
      </div>
    </Section>
  );
}

