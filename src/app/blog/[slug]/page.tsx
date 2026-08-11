import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { findPost } from "@/lib/portfolio-db";
import { serializePost } from "@/lib/portfolio-serializers";
import { ReadingProgress } from "@/components/effects/Aurora";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findPost(slug, false);
  if (!post) return { title: "Blog | Inomjon Toshmirzayev" };
  return {
    title: `${post.title} | Inomjon Toshmirzayev`,
    description: post.excerpt,
  };
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findPost(slug, false);
  if (!post) notFound();
  const view = serializePost(post);

  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <ReadingProgress />

      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Bloga qaytish
        </Link>

        {/* Meta row */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} />
            {new Date(view.created_at).toLocaleDateString("uz-UZ")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {readingTime(view.content)}
          </span>
          <span className="flex items-center gap-1.5">
            <User size={13} />
            Inomjon Toshmirzayev
          </span>
        </div>

        {/* Title — large artistic serif */}
        <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.15] tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          {view.title}
        </h1>

        {/* Silver accent line */}
        <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#999999]/70 to-transparent" />

        {view.excerpt && (
          <p className="mt-6 text-lg leading-8 text-zinc-500 dark:text-zinc-400">
            {view.excerpt}
          </p>
        )}

        {view.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={view.cover_url}
            alt={view.title}
            className="ring-chrome mt-8 w-full rounded-3xl border border-black/[0.08] dark:border-white/[0.07]"
          />
        )}

        {/* Content — artistic typography */}
        <div className="card-luxe prose-prose relative mt-10 overflow-hidden rounded-3xl p-8 sm:p-10">
          <div className="orb -right-20 -top-20 h-48 w-48 bg-[#999999]/15 dark:bg-[#999999]/10" />
          <div className="relative z-10 space-y-6 text-[16px] leading-8 text-zinc-600 dark:text-zinc-300 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-6xl [&>p:first-child]:first-letter:font-black [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-[#999999]">
            {view.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Back CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/blog"
            className="shine inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#999999]/40 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-[#999999] hover:text-zinc-900 hover:shadow-[0_0_24px_rgba(153,153,153,0.25)] dark:text-zinc-300 dark:hover:text-white"
          >
            <ArrowLeft size={14} />
            Bloga qaytish
          </Link>
        </div>
      </article>
    </main>
  );
}