// components/admin/TopPagesTable.tsx

"use client";

interface TopPagesTableProps {
  pages: Array<{ type: string; slug: string; count: number }>;
}

export default function TopPagesTable({ pages }: TopPagesTableProps) {
  if (pages.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
        No page data available yet
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-sb-cream mb-4">Top Visited Pages</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sb-cream/20">
              <th className="text-left py-3 px-4 text-sb-cream/80 font-semibold uppercase text-xs tracking-wider">
                Rank
              </th>
              <th className="text-left py-3 px-4 text-sb-cream/80 font-semibold uppercase text-xs tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-4 text-sb-cream/80 font-semibold uppercase text-xs tracking-wider">
                Page
              </th>
              <th className="text-right py-3 px-4 text-sb-cream/80 font-semibold uppercase text-xs tracking-wider">
                Visits
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, index) => (
              <tr
                key={`${page.type}-${page.slug}`}
                className="border-b border-sb-cream/10 hover:bg-sb-cream/5 transition-colors"
              >
                <td className="py-3 px-4 text-sb-cream/60">#{index + 1}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sb-ocean/20 text-sb-cream">
                    {page.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sb-cream">
                  <a
                    href={`/${page.type === "safari" ? "safaris" : "zanzibar-tours"}/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sb-cream/80 hover:underline transition-colors"
                  >
                    {page.slug.replace(/-/g, " ")}
                  </a>
                </td>
                <td className="py-3 px-4 text-right text-sb-cream font-semibold">
                  {page.count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

