import { Button } from "@/components/ui/Button";

type Props = {
  tourTitle: string;
};

export default function BookingPanelPlaceholder({ tourTitle }: Props) {
  return (
    <aside className="sticky top-24 rounded-2xl border border-dashed border-sb-mist/90 bg-sb-shell/80 p-4 text-sm text-sb-ink/80">
      <h3 className="font-display text-base font-semibold text-sb-ocean">
        Enquire or book this experience
      </h3>
      <p className="mt-2 text-xs text-sb-ink/70">
        This is a reserved space for the Savana Blu booking widget. In the next
        batch, you&apos;ll be able to select your date, guests and complete
        payment securely.
      </p>
      <div className="mt-4 space-y-2 text-xs">
        <p>
          Tour: <span className="font-medium">{tourTitle}</span>
        </p>
        <p>
          For now, you can{" "}
          <a
            href="mailto:hello@savanablu.com"
            className="font-medium text-sb-lagoon hover:text-sb-ocean"
          >
            email us
          </a>{" "}
          with your dates and preferred group size.
        </p>
      </div>
      <div className="mt-5">
        <Button variant="primary" size="md" disabled className="w-full">
          Booking widget coming soon
        </Button>
      </div>
    </aside>
  );
}
