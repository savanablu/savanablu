// app/blog/[slug]/page.tsx

import Section from "@/components/ui/Section";

import Link from "next/link";

import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "@/lib/data/blog";
import { serialize } from "next-mdx-remote/serialize";
import MDXContent from "@/components/blog/MDXContent";



type BlogPageProps = {

  params: {

    slug: string;

  };

};



export async function generateStaticParams() {

  const posts = await getAllPosts();



  return posts.map((post) => ({

    slug: post.slug,

  }));

}



export async function generateMetadata({ params }: BlogPageProps) {

  const post = await getPostBySlug(params.slug);



  if (!post) {

    return {};

  }



  return {

    title: post.title

      ? `${post.title} | Savana Blu Journal`

      : "Savana Blu Journal | Zanzibar Notes",

    description:

      post.description ??

      post.excerpt ??

      "A calm, practical note from Savana Blu about planning time in Zanzibar.",

  };

}



export default async function BlogPostPage({ params }: BlogPageProps) {

  const post = await getPostBySlug(params.slug);



  if (!post) {

    notFound();

  }



  const { slug, title, description, excerpt, date, readingTime, content } = post;

  // Serialize MDX content for Client Component
  const mdxSource = await serialize(content);



  const titleText = title ?? "Savana Blu Journal";

  const descriptionText =

    description ??

    excerpt ??

    "A calm, practical note from Zanzibar by Savana Blu.";

  const dateLabel = date

    ? new Date(date).toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "short",

        year: "numeric",

      })

    : null;



  return (

    <Section className="pb-20 pt-16">

      <div className="mx-auto max-w-5xl space-y-8">

        {/* TOP BAR / BREADCRUMB */}

        <div className="flex items-center justify-between gap-3 text-[0.85rem] text-sb-ink/70">

          <Link

            href="/blog"

            className="inline-flex items-center gap-1 rounded-full border border-sb-mist/80 bg-white/80 px-3 py-1.5 text-[0.8rem] font-semibold text-sb-ink/80 hover:border-sb-ocean/60 hover:text-sb-ocean"

          >

            <span className="text-[1rem]">←</span>

            <span>Back to journal</span>

          </Link>

          {slug && (

            <span className="hidden text-[0.78rem] uppercase tracking-[0.14em] text-sb-ink/55 sm:inline">

              Savana Blu Journal

            </span>

          )}

        </div>



        {/* HEADER BAND */}

        <header className="rounded-3xl bg-sb-shell/90 px-6 py-6 shadow-sm ring-1 ring-sb-mist/80 sm:px-8 sm:py-7">

          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-sb-ocean to-sb-deep" />



          <div className="mt-4 space-y-3">

            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-ink/70">

              Savana Blu Journal · Zanzibar

            </p>

            <h1 className="font-display text-2xl text-sb-night sm:text-3xl">

              {titleText}

            </h1>

            <p className="max-w-3xl text-[0.95rem] leading-relaxed text-sb-ink/85">

              {descriptionText}

            </p>

          </div>



          <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.8rem] text-sb-ink/75">

            {dateLabel && (

              <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1">

                {dateLabel}

              </span>

            )}

            {readingTime && (

              <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1">

                {readingTime}

              </span>

            )}

            <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1">

              Zanzibar · Travel notes

            </span>

          </div>

        </header>



        {/* CONTENT */}

        <article className="mx-auto max-w-3xl rounded-3xl bg-white/95 p-6 text-[0.95rem] leading-relaxed text-sb-ink/90 shadow-sm ring-1 ring-sb-mist/70 sm:p-8">

          {/* Basic typography tweaks for MDX content */}

          <div className="space-y-4 [&_h2]:mt-6 [&_h2]:text-[1.05rem] [&_h2]:font-semibold [&_h2]:text-sb-night [&_h3]:mt-5 [&_h3]:text-[1rem] [&_h3]:font-semibold [&_h3]:text-sb-night [&_p]:leading-relaxed [&_p+ p]:mt-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_a]:text-sb-ocean [&_a]:underline [&_strong]:font-semibold">

            <MDXContent source={mdxSource} />

          </div>

        </article>



        {/* FOOTNOTE CTA */}

        <section className="mx-auto max-w-3xl rounded-3xl bg-sb-shell/80 px-4 py-5 shadow-sm ring-1 ring-sb-mist/80 sm:px-6 sm:py-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="space-y-1.5">

              <h2 className="font-display text-sm text-sb-night">

                Want help planning your own days like this?

              </h2>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">

                Share your dates, where you&apos;re staying and who

                you&apos;re travelling with. We&apos;ll suggest a calm outline

                for your time in Zanzibar – no pressure to book.

              </p>

            </div>

            <div className="flex flex-col items-start gap-2 text-[0.85rem] sm:items-end">

              <Link

                href="/contact"

                className="inline-flex items-center rounded-full bg-sb-night px-4 py-2 font-semibold text-sb-shell hover:bg-sb-ocean"

              >

                Message the Savana Blu team

              </Link>

              <p className="text-[0.78rem] text-sb-ink/70 text-right">

                You can also use the WhatsApp button on the screen to message us

                in Zanzibar time (UTC+3).

              </p>

            </div>

          </div>

        </section>

      </div>

    </Section>

  );

}
