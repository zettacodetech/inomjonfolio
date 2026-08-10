import { getPostViews } from "@/lib/data";
import { BlogCard } from "@/components/blog/BlogCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Inomjon Toshmirzayev",
  description: "Articles and updates by Inomjon Toshmirzayev on backend development.",
};

export default async function BlogPage() {
  const posts = await getPostViews(false);

  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          Blog
        </p>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-5xl">
          Maqolalar va yangiliklar
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          Texnologiya, loyihalar va backend ishlanmalari haqida yozuvlar.
        </p>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-zinc-200 py-24 text-center dark:border-white/10">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Hali maqolalar yo'q.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}