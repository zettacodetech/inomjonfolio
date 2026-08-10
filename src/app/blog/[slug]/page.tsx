import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { findPost } from "@/lib/portfolio-db";
import { serializePost } from "@/lib/portfolio-serializers";

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
    <main className="min-h-screen px-4 pt-28 pb-16 dark:bg-white/[0.0]">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft size={14} />
          Bloga qaytish
        </Link>

        <div className="mt-8 flex items-center gap-2 text-xs text-zinc-400">
          <CalendarDays size={13} />
          {new Date(view.created_at).toLocaleDateString("uz-UZ")}
        </div>

        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-5xl">
          {view.title}
        </h1>

        {view.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={view.cover_url}
            alt={view.title}
            className="mt-8 w-full rounded-3xl border border-black/[0.08] ring-chrome dark:border-white/[0.07]"
          />
        )}

        <div className="card-luxe prose-prose mt-10 space-y-5 rounded-3xl p-8 text-[15px] leading-8 text-zinc-600 dark:text-zinc-300">
          {view.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}