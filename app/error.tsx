"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sb-shell px-4">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold text-sb-ocean mb-4">
          Something went wrong!
        </h2>
        <p className="text-sb-ink/75 mb-8">
          {error.message || "An unexpected error occurred"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-sb-ocean px-5 py-2.5 text-sm font-medium text-sb-shell transition hover:bg-sb-lagoon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sb-lagoon/80"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

