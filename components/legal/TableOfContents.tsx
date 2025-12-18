"use client";

type Section = {
  id: string;
  title: string;
};

type TableOfContentsProps = {
  sections: Section[];
};

export default function TableOfContents({ sections }: TableOfContentsProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-4 backdrop-blur-sm">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-sb-ink/60">
          Contents
        </h2>
        <nav className="space-y-1.5">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block rounded-lg px-2.5 py-1.5 text-[0.85rem] text-sb-ink/75 transition-colors hover:bg-sb-mist/40 hover:text-sb-ocean"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

