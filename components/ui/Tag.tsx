import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TagTone = "neutral" | "highlight" | "subtle";

interface TagProps extends HTMLAttributes<HTMLDivElement> {
  tone?: TagTone;
  children: ReactNode;
}

export default function Tag({ tone = "neutral", children, className, ...rest }: TagProps) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.78rem] uppercase tracking-[0.18em]";

  const tones: Record<TagTone, string> = {
    neutral: "border-sb-mist/80 bg-sb-shell/80 text-sb-ink/70",
    highlight: "border-sb-lagoon/40 bg-sb-lagoon/5 text-sb-lagoon",
    subtle: "border-sb-mist/60 bg-transparent text-sb-ink/60"
  };

  return (
    <div className={cn(base, tones[tone], className)} {...rest}>
      {children}
    </div>
  );
}
