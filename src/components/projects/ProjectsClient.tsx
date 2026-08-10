"use client";

import { useMemo, useState } from "react";
import { motion, type Transition } from "framer-motion";
import { Github } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { ApiProjectCard } from "@/components/projects/ApiProjectCard";
import type { ProjectView } from "@/lib/data";
import type { Tag } from "@/lib/data";

type Props = {
  projects: ProjectView[];
  github: { followers: number; public_repos: number; avatar: string } | null;
};

const ft = (delay = 0): Transition => ({ duration: 0.5, ease: "easeOut", delay });

export function ProjectsClient({ projects, github }: Props) {
  const { t } = useLanguage();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const map = new Map<string, Tag>();
    for (const project of projects) {
      for (const tag of project.tags) map.set(tag.slug, tag);
    }
    return Array.from(map.values());
  }, [projects]);

  const filtered = useMemo(() => {
    if (!activeTag) return projects;
    return projects.filter((project) => project.tags.some((tag) => tag.slug === activeTag));
  }, [projects, activeTag]);

  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ft(0)}
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500"
          >
            {t.portfolioLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ft(0.07)}
            className="mt-4 font-serif text-4xl font-bold text-zinc-900 dark:text-white sm:text-5xl"
          >
            {t.selectedWork}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ft(0.14)}
            className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400"
          >
            {t.projectsDesc}
          </motion.p>
        </div>

        {/* GitHub stats widget */}
        {github && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ft(0.16)}
            className="mb-8 flex items-center gap-4 rounded-3xl border border-black/[0.08] bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-[#111111] dark:shadow-none"
          >
            {github.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={github.avatar}
                alt="GitHub avatar"
                className="h-12 w-12 rounded-2xl border border-zinc-200 dark:border-white/10"
              />
            )}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              <div>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{github.public_repos}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Repositories</p>
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{github.followers}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Followers</p>
              </div>
            </div>
            <a
              href="https://github.com/Toshmirzayev-Inomjon"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition-all hover:border-zinc-400 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-300 dark:hover:border-white/25 dark:hover:text-white"
            >
              <Github size={13} />
              GitHub
            </a>
          </motion.div>
        )}

        {/* Tag filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ft(0.18)}
            className="mb-8 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTag === null
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/25 dark:hover:text-white"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(activeTag === tag.slug ? null : tag.slug)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeTag === tag.slug
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:border-white/25 dark:hover:text-white"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={ft(0.2)}
            className="text-sm text-zinc-400"
          >
            No projects yet.
          </motion.p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <ApiProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}