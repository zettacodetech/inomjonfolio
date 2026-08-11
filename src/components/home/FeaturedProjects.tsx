"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, type Transition } from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { ApiProjectCard } from "@/components/projects/ApiProjectCard";
import type { ProjectView } from "@/lib/data";

const ft = (delay = 0): Transition => ({ duration: 0.5, ease: "easeOut", delay });

export function FeaturedProjects({ projects }: { projects: ProjectView[] }) {
  const { t } = useLanguage();

  if (projects.length === 0) return null;

  return (
    <section className="mt-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={ft(0)}
        className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500"
      >
        {t.featuredLabel}
      </motion.p>

      <div className="mt-6 flex items-end justify-between gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={ft(0.07)}
          className="font-serif text-3xl font-bold text-zinc-900 dark:text-white"
        >
          {t.featuredTitle}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={ft(0.14)}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-[#999999]"
          >
            {t.viewAllProjects}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((project, i) => (
          <ApiProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}