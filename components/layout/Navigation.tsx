import Link from "next/link";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Zanzibar Tours", href: "/zanzibar-tours" },
  { label: "Safaris", href: "/safaris" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" }
];

interface NavigationProps {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}

export default function Navigation({
  orientation = "horizontal",
  onNavigate
}: NavigationProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <nav aria-label="Primary navigation">
      <ul
        className={cn(
          "flex gap-2 text-sm",
          isHorizontal ? "flex-row items-center" : "flex-col items-start py-3"
        )}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-medium tracking-wide text-sb-ink/75 transition hover:text-sb-ocean",
                isHorizontal &&
                  "hover:bg-sb-mist/60",
                !isHorizontal &&
                  "w-full rounded-xl bg-sb-shell px-4 py-2.5 text-sm hover:bg-sb-mist/70"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
