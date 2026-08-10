"use client";

import Image from "next/image";
import { MapPin, Sparkles } from "lucide-react";
import { motion, type Transition } from "framer-motion";
import type { PortfolioStatsView } from "@/lib/data";

export function ProfileCard({ stats }: { stats: PortfolioStatsView }) {
  const expYears = stats.experience_years > 0 ? `${stats.experience_years}+` : "1+";

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 } as Transition}
      className="flex justify-center lg:justify-end"
    >
      <div className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-md dark:border-white/[0.07] dark:bg-[#111111] dark:shadow-2xl">
        {/* Profile image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Image
            src="/uploads/profile-inomjon.webp"
            alt="Inomjon Toshmirzayev"
            fill
            className="object-cover object-top"
            priority
            sizes="320px"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-[#111111]" />
        </div>

        {/* Info */}
        <div className="px-5 pb-5 pt-1">
          <p className="font-serif text-xl font-semibold text-zinc-900 dark:text-white">
            Inomjon Toshmirzayev
          </p>
          <p className="mt-0.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
            Backend Developer
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
            <MapPin size={12} />
            Qashqadaryo, Uzbekistan
          </div>

          {/* Experience badge */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-black/[0.07] bg-zinc-50 px-3.5 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <Sparkles size={13} className="text-zinc-400 dark:text-[#999999]" />
            <span className="font-serif text-lg font-bold leading-none text-zinc-900 dark:text-white">
              {expYears}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] leading-tight text-zinc-400 dark:text-zinc-500">
              Years
              <br />
              Experience
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
