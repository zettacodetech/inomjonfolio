"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { motion, type Transition } from "framer-motion";
import type { PortfolioStatsView } from "@/lib/data";

export function ProfileCard({ stats }: { stats: PortfolioStatsView }) {
  const expYears = stats.experience_years > 0 ? `${stats.experience_years}+` : "1+";
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -16, y: px * 16 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 } as Transition}
      className="flex justify-center lg:justify-end [perspective:1200px]"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.18s ease-out",
        }}
        className="card-luxe shine group relative w-full max-w-[320px] rounded-2xl p-[1px] overflow-hidden"
      >
        {/* Orbital glow halo */}
        <div className="orb -top-20 left-1/2 h-48 w-48 -translate-x-1/2 bg-[#999999]/30 dark:bg-[#999999]/20" />

        <div className="relative overflow-hidden rounded-2xl">
          {/* Profile image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <Image
              src="/uploads/profile-inomjon.webp"
              alt="Inomjon Toshmirzayev"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="320px"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-[#111111]" />
          </div>

          {/* Info */}
          <div className="relative z-10 px-5 pb-5 pt-1">
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
            <div className="chip-3d mt-4 flex items-center gap-2 px-3.5 py-2.5">
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
      </div>
    </motion.div>
  );
}