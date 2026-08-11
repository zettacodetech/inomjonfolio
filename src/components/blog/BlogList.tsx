"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";

type PostView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  created_at: string;
};

export function BlogList({ posts }: { posts: PostView[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        (post.excerpt ?? "").toLowerCase().includes(q)
    );
  }, [posts, query]);

  return (
    <>
      {/* Search */}
      <div className="relative mt-8 max-w-md">
        <Search
          size={15}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Maqolalarni izlash..."
          className="w-full rounded-full border border-black/[0.09] bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-[#999999]/60 focus:shadow-[0_0_0_3px_rgba(153,153,153,0.12)] dark:border-white/[0.08] dark:bg-[#131316] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#999999]/50 dark:focus:shadow-[0_0_0_3px_rgba(153,153,153,0.08)]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-zinc-200 py-24 text-center dark:border-white/10">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {query ? `"${query}" bo'yicha hech narsa topilmadi.` : "Hali maqolalar yo'q."}
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {filtered.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </>
  );
}