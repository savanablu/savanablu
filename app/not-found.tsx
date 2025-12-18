import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sb-shell px-4">
      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold text-sb-ocean mb-4">
          404
        </h1>
        <p className="text-lg text-sb-ink/75 mb-8">
          This page could not be found.
        </p>
        <ButtonLink href="/" variant="primary">
          Return Home
        </ButtonLink>
      </div>
    </div>
  );
}

