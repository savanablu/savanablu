// app/blog/page.tsx

import Section from "@/components/ui/Section";

import Link from "next/link";

import { getAllPosts } from "@/lib/data/blog";



export const metadata = {

  title: "Zanzibar Travel Journal & Tips | Savana Blu",

  description:

    "Calm, practical notes from Savana Blu on when to visit Zanzibar, how to choose experiences, and how to travel gently around the islands.",

};



export default async function BlogPage() {

  const posts = await getAllPosts();



  // Transform to match expected structure with frontMatter

  const transformedPosts = posts.map((post) => ({

    slug: post.slug,

    frontMatter: {

      title: post.title,

      date: post.date,

      description: post.description ?? post.excerpt,

      readingTime: post.readingTime,

      tags: post.tags,

      featured: post.featured,

    },

  }));



  // De-duplicate posts by slug (safety net)

  const uniquePosts =

    transformedPosts?.filter(

      (post, index, self) =>

        self.findIndex((p) => p.slug === post.slug) === index

    ) ?? [];



  // Sort by date (newest first) if date exists

  const sortedPosts = uniquePosts.sort((a, b) => {

    const dateA = a.frontMatter.date

      ? new Date(a.frontMatter.date).getTime()

      : 0;

    const dateB = b.frontMatter.date

      ? new Date(b.frontMatter.date).getTime()

      : 0;

    return dateB - dateA;

  });



  return (

    <Section className="pb-20 pt-16">

      <div className="mx-auto max-w-6xl space-y-8">

        {/* HERO – similar to Tours / FAQ / Contact */}

        <header className="relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-sb-mist/70">

          {/* Background image */}

          <div className="absolute inset-0">

            <div

              className="h-full w-full bg-cover bg-center"

              style={{ backgroundImage: "url(/images/blog-hero.jpg)" }}

            />

            {/* Overlay for readability */}

            <div className="absolute inset-0 bg-gradient-to-br from-sb-night/60 via-sb-night/40 to-sb-ocean/30" />

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" />

          </div>



          {/* Content */}

          <div className="relative px-6 py-8 text-sb-shell sm:px-8 sm:py-10">

            <div className="inline-block rounded-2xl bg-sb-night/40 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">

              <div className="h-1 w-20 rounded-full bg-gradient-to-r from-sb-shell/85 to-sb-ocean/90" />



              <div className="mt-4 space-y-3">

                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/90">

                  Savana Blu Journal

                </p>

                <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">

                  Quiet, honest notes from Zanzibar

                </h1>

                <p className="max-w-3xl text-[0.95rem] leading-relaxed text-sb-shell/95">

                  Short pieces to help you plan calm days on the islands — when

                  to visit, how to choose experiences, and how to travel gently around

                  reefs, sandbanks and Stone Town.

                </p>

              </div>

            </div>



            <div className="mt-5 grid gap-3 text-[0.85rem] sm:grid-cols-3">

              <div className="rounded-2xl bg-sb-shell/18 px-3 py-2 backdrop-blur-sm">

                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                  Practical timing

                </p>

                <p className="mt-0.5 text-sb-shell/95">

                  Seasons, light and tides explained in plain language.

                </p>

              </div>

              <div className="rounded-2xl bg-sb-shell/18 px-3 py-2 backdrop-blur-sm">

                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                  Choosing days well

                </p>

                <p className="mt-0.5 text-sb-shell/95">

                  When to pick ocean days, town days and quieter moments.

                </p>

              </div>

              <div className="rounded-2xl bg-sb-shell/20 px-3 py-2 backdrop-blur-sm">

                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                  Gentle travel

                </p>

                <p className="mt-0.5 text-sb-shell/95">

                  Oceans, reefs and communities treated with care.

                </p>

              </div>

            </div>

          </div>

        </header>



        {/* BLOG LIST – compact cards */}

        {sortedPosts.length === 0 ? (

          <p className="text-[0.95rem] text-sb-ink/80">

            We&apos;re still writing our first set of notes. Please check back

            soon, or contact us if you have a specific question about planning

            time in Zanzibar.

          </p>

        ) : (

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {sortedPosts.map((post) => {

              const { slug, frontMatter } = post;

              const title = frontMatter.title ?? "Untitled";

              const description =

                frontMatter.description ??

                "A short note from Zanzibar by Savana Blu.";

              const dateLabel = frontMatter.date

                ? new Date(frontMatter.date).toLocaleDateString("en-GB", {

                    day: "2-digit",

                    month: "short",

                    year: "numeric",

                  })

                : null;

              const readingTime = frontMatter.readingTime;



              return (

                <article

                  key={slug}

                  className="flex h-full flex-col rounded-2xl border border-sb-mist/80 bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"

                >

                  <div className="flex items-center justify-between gap-2 text-[0.78rem] text-sb-ink/65">

                    {dateLabel && <span>{dateLabel}</span>}

                    {readingTime && <span>{readingTime}</span>}

                  </div>

                  <h2 className="mt-2 font-display text-[1.05rem] text-sb-night">

                    {title}

                  </h2>

                  <p className="mt-2 line-clamp-3 text-[0.9rem] leading-relaxed text-sb-ink/85">

                    {description}

                  </p>



                  <div className="mt-auto flex items-center justify-between border-t border-sb-mist/60 pt-3 text-[0.85rem]">

                    <span className="rounded-full bg-sb-shell/80 px-2 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">

                      Zanzibar · Travel notes

                    </span>

                    <Link

                      href={`/blog/${slug}`}

                      className="inline-flex items-center font-semibold text-sb-ocean hover:text-sb-deep"

                    >

                      Read article

                      <span className="ml-1 text-[1rem]">↗</span>

                    </Link>

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </div>

    </Section>

  );

}
