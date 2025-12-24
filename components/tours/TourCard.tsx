import Link from "next/link";
import type { Tour } from "@/lib/data/tours";
import { ButtonLink } from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";

type Props = {
  tour: Tour;
};

export default function TourCard({ tour }: Props) {
  const mainImage = tour.images[0] ?? "/images/placeholder-tour.jpg";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-sb-mist/80 bg-sb-shell/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft-elevated">
      <div className="relative h-40 w-full overflow-hidden bg-sb-mist/60">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${mainImage})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sb-night/40 via-transparent" />
        <div className="absolute left-3 top-3">
          <Tag tone="highlight">
            <span className="h-1 w-1 rounded-full bg-sb-lagoon" />
            {tour.category}
          </Tag>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <h3 className="font-display text-lg font-semibold text-sb-ocean min-h-[2.5rem]">
          {tour.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-sb-ink/75 min-h-[4rem]">
          {tour.shortDescription}
        </p>

        <dl className="mt-2 grid grid-cols-2 gap-2 text-[0.78rem] text-sb-ink/65 min-h-[5rem]">
          <div>
            <dt className="uppercase tracking-[0.18em]">Location</dt>
            <dd className="mt-0.5 text-[0.85rem] text-sb-ink/80">
              {tour.location}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.18em]">Duration</dt>
            <dd className="mt-0.5 text-[0.85rem] text-sb-ink/80">
              Approx. {tour.durationHours} hours
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.18em]">From</dt>
            <dd className="mt-0.5 text-[0.85rem] text-sb-ocean font-semibold">
              USD {tour.basePrice.toFixed(0)} per adult
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.18em]">Style</dt>
            <dd className="mt-0.5 text-[0.85rem] text-sb-ink/80">
              {tour.privateOptionAvailable
                ? "Small-group & private"
                : "Small-group only"}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Link
            href={`/tours/${tour.slug}`}
            className="text-xs font-medium text-sb-lagoon hover:text-sb-ocean"
          >
            Learn more about this experience
          </Link>
          <ButtonLink
            href={`/tours/${tour.slug}`}
            variant="primary"
            size="sm"
            aria-label={`View Experience: ${tour.title}`}
          >
            View Experience
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
