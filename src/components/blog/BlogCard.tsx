"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Tilt3D } from "@/components/effects/Tilt3D";

type PostView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  created_at: string;
};

export function BlogCard({ post, index }: { post: PostView; index: number }) {
  return (
    <Tilt3D className="[perspective:1200px]">
      <Link
        href={`/blog/${post.slug}`}
        className="card-luxe shine group relative flex h-full flex-col overflow-hidden rounded-3xl p-7"
      >
        <div className="orb -right-16 -top-16 h-40 w-40 bg-[#999999]/15 dark:bg-[#999999]/10" />
        <div className="relative z-10 flex items-center gap-2 text-xs text-zinc-400">
          <CalendarDays size={13} />
          {new Date(post.created_at).toLocaleDateString("uz-UZ")}
        </div>
        <h2 className="relative z-10 mt-3 font-serif text-2xl font-bold leading-snug text-zinc-900 transition-colors group-hover:text-[#999999] dark:text-white dark:group-hover:text-[#999999]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="relative z-10 mt-3 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {post.excerpt}
          </p>
        )}
        <span className="relative z-10 mt-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          O'qish
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </Tilt3D>
  );
}