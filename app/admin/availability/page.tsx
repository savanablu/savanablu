import type { Metadata } from "next";
import Section from "@/components/ui/Section";
import { getAllTours } from "@/lib/data/tours";
import { getAllPackages } from "@/lib/data/packages";
import AvailabilityAdmin from "@/components/admin/AvailabilityAdmin";

export const metadata: Metadata = {
  title: "Manage Availability | Admin",
  description: "Manage tour availability and blocked dates",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminAvailabilityPage() {
  const tours = await getAllTours();
  const packages = await getAllPackages();

  const tourSummaries = tours.map((t) => ({
    slug: t.slug,
    title: t.title,
  }));

  const packageSummaries = packages.map((p) => ({
    slug: p.slug,
    title: p.title,
  }));

  return (
    <Section className="pb-12 pt-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="font-display text-2xl text-sb-night">
            Availability
          </h1>
          <p className="max-w-2xl text-sm text-sb-ink/80">
            Block out dates you don&apos;t want to sell – either globally,
            for specific day tours, or for multi-day packages. These dates will
            be disabled in the guest booking calendar.
          </p>
        </header>

        <AvailabilityAdmin tours={tourSummaries} packages={packageSummaries} />
      </div>
    </Section>
  );
}
