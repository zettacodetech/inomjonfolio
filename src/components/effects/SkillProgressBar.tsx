"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function SkillProgressBar({
  name,
  level,
  delay = 0,
}: {
  name: string;
  level: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const safeLevel = Math.min(100, Math.max(0, level));

  return (
    <div ref={ref} className="group">
      <div className="mb-1.5 flex items-baseline justify-between">
        <p className="text-xs font-semibold text-zinc-700 transition-colors group-hover:text-[#999999] dark:text-zinc-300">
          {name}
        </p>
        <p className="text-[10px] font-bold text-zinc-400 dark:text-[#999999]">
          {safeLevel}%
        </p>
      </div>
      <div className="h-[6px] w-full overflow-hidden rounded-full border border-black/[0.06] bg-zinc-100 dark:border-white/[0.06] dark:bg-white/[0.04]">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${safeLevel}%` } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
          className="h-full rounded-full bg-gradient-to-r from-[#777] via-[#999999] to-[#ccc] shadow-[0_0_12px_rgba(153,153,153,0.45)]"
        />
      </div>
    </div>
  );
}