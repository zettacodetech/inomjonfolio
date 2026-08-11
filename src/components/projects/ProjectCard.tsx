"use client";

import { motion, type Transition } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio-data";
import type { Lang } from "@/lib/i18n";

type Props = {
  project: Project;
  lang: Lang;
  index: number;
};

export function ProjectCard({ project, lang, index }: Props) {
  const stackVisible = project.stack.slice(0, 2);
  const overflow = project.stack.length - 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 * index } as Transition}
      className="group [perspective:1200px]"
    >
      <div className="card-luxe shine relative flex h-full flex-col overflow-hidden rounded-2xl">
        {/* Gradient header with watermark */}
        <div
          className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${project.gradient} transition-all duration-500 group-hover:h-44`}
        >
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 transition-transform duration-500 group-hover:scale-125" />
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 transition-transform duration-500 group-hover:scale-125" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 select-none font-serif text-[8rem] font-black leading-none text-black/5 transition-transform duration-700 group-hover:scale-110 dark:text-white/5">
            {project.watermark}
          </span>
          <span
            className={`relative z-10 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${project.tagColor}`}
          >
            {project.category[lang]}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col bg-white p-5 dark:bg-[#131316]">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl font-bold leading-tight text-zinc-900 transition-colors group-hover:text-[#999999] dark:text-white">
              {project.title}
            </h3>
            <ArrowUpRight
              size={16}
              className="mt-0.5 shrink-0 text-zinc-300 transition-all group-hover:text-zinc-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-zinc-600 dark:group-hover:text-white"
            />
          </div>

          <p className="mt-2.5 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-500">
            {project.description[lang]}
          </p>

          {/* Tech pills */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {stackVisible.map((tech) => (
              <span key={tech} className="chip-3d px-2.5 py-1 text-[10px]">
                {tech}
              </span>
            ))}
            {overflow > 0 && (
              <span className="chip-3d px-2.5 py-1 text-[10px]">
                +{overflow}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}