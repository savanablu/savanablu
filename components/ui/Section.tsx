import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionBackground = "shell" | "sand" | "ocean" | "transparent";

interface SectionProps {
  id?: string;
  background?: SectionBackground;
  className?: string;
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function Section({
  id,
  background = "transparent",
  className,
  children,
  eyebrow,
  title,
  subtitle,
  align = "left"
}: SectionProps) {
  const bgClass =
    background === "shell"
      ? "bg-sb-shell"
      : background === "sand"
      ? "bg-sb-sand"
      : background === "ocean"
      ? "bg-sb-ocean text-sb-shell"
      : "";

  const alignClass =
    align === "center"
      ? "text-center items-center"
      : "text-left items-start";

  return (
    <section id={id} className={cn(bgClass, "py-10 sm:py-14 md:py-16")}>
      <div className="container-page">
        {(eyebrow || title || subtitle) && (
          <header
            className={cn(
              "mb-8 flex flex-col gap-3 md:mb-10",
              alignClass
            )}
          >
            {eyebrow && (
              <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-sb-ink/60">
                {eyebrow}
              </div>
            )}

            {title && (
              <h2 className="font-display text-2xl leading-tight text-sb-night sm:text-3xl md:text-4xl">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="max-w-2xl text-sm text-sb-ink/75 md:text-base">
                {subtitle}
              </p>
            )}
          </header>
        )}

        <div className={cn("", align === "center" && "mx-auto")}>{children}</div>
      </div>
    </section>
  );
}
