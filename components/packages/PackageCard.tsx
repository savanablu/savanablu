import Link from "next/link";
import type { Package } from "@/lib/data/packages";
import { ButtonLink } from "@/components/ui/Button";

type Props = {
  pkg: Package;
};

export default function PackageCard({ pkg }: Props) {
  const nights = pkg.days?.length ?? 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-sb-mist/80 bg-sb-shell/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft-elevated">
      {pkg.image && (
        <div className="relative h-40 w-full overflow-hidden bg-sb-mist/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pkg.image}
            alt={pkg.title}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sb-night/40 via-transparent" />
        </div>
      )}

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <h2 className="font-display text-lg font-semibold text-sb-ocean min-h-[2.5rem]">
          {pkg.title}
        </h2>
        <p className="mt-1.5 line-clamp-3 text-sm text-sb-ink/75 min-h-[4rem]">
          {pkg.shortDescription}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.72rem] text-sb-ink/65 min-h-[3.5rem]">
          {nights > 0 && (
            <span className="rounded-full bg-sb-mist/50 px-2 py-0.5">
              {nights} days / {nights - 1 > 0 ? `${nights - 1} nights` : "1 night"}
            </span>
          )}
          <span className="rounded-full bg-sb-shell px-2 py-0.5">
            From{" "}
            <span className="font-semibold text-sb-night">
              USD {pkg.priceFrom.toLocaleString("en-US")}
            </span>{" "}
            per person
          </span>
          <span className="rounded-full bg-sb-mist/50 px-2 py-0.5">
            Boutique · small groups · private options
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Link
            href={`/packages/${pkg.slug}`}
            className="text-xs font-medium text-sb-lagoon hover:text-sb-ocean"
          >
            View Experience
          </Link>
          <ButtonLink
            href={`/packages/${pkg.slug}`}
            variant="primary"
            size="sm"
            aria-label={`View Experience: ${pkg.title}`}
          >
            View Experience
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
