import { getPostViews } from "@/lib/data";
import { BlogList } from "@/components/blog/BlogList";

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
        {/* Artistic header */}
        <div className="relative overflow-hidden rounded-3xl border border-black/[0.07] bg-white p-8 shadow-sm sm:p-10 dark:border-white/[0.07] dark:bg-[#131316]">
          <div className="orb -right-20 -top-20 h-56 w-56 bg-[#999999]/15 dark:bg-[#999999]/10" />
          <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-[#999999]">
            Blog
          </p>
          <h1 className="relative z-10 mt-4 font-serif text-4xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-5xl">
            Maqolalar va{" "}
            <span className="text-zinc-400 dark:text-holo">yangiliklar</span>
          </h1>
          <p className="relative z-10 mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Texnologiya, loyihalar va backend ishlanmalari haqida yozuvlar.
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </main>
  );
}