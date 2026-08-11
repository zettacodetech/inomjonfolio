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
    setTilt({ x: py * -12, y: px * 12 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 } as Transition}
      className="flex justify-center lg:justify-end [perspective:1400px]"
    >
      {/* Back glow plate behind card */}
      <div className="relative">
        <div className="orb absolute -inset-8 -z-10 bg-[#999999]/25 dark:bg-[#999999]/15" />

        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.18s ease-out",
          }}
          className="card-luxe shine group relative w-full max-w-[400px] rounded-3xl p-[1px] overflow-hidden"
        >
          {/* Rotating silver halo ring */}
          <div
            className="halo absolute inset-[-160px] opacity-70 transition-opacity duration-500 group-hover:opacity-100 dark:opacity-50 dark:group-hover:opacity-80"
            style={{ zIndex: 1 }}
          />

          {/* Orbital glow halo */}
          <div className="orb -top-24 left-1/2 h-56 w-56 -translate-x-1/2 bg-[#999999]/30 dark:bg-[#999999]/20" />

          {/* Floating "ONLINE" badge — floats above card */}
          <div
            className="absolute -right-3 top-6 z-20 flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#151515]/90 dark:text-[#999999]"
            style={{ transform: "translateZ(60px)" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Online
          </div>

          <div className="relative overflow-hidden rounded-3xl" style={{ zIndex: 2 }}>
            {/* Profile image — taller for showcase */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <Image
                src="/uploads/profile-inomjon.webp"
                alt="Inomjon Toshmirzayev"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="400px"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent dark:from-[#17171a]" />
            </div>

            {/* Info — larger typography */}
            <div className="relative z-10 px-6 pb-6 pt-2">
              <p className="font-serif text-2xl font-semibold text-zinc-900 dark:text-white">
                Inomjon Toshmirzayev
              </p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-[#999999]">
                Backend Developer
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                <MapPin size={12} />
                Qashqadaryo, Uzbekistan
              </div>

              {/* Experience badge */}
              <div className="chip-3d mt-5 flex items-center gap-3 px-4 py-3">
                <Sparkles size={14} className="text-zinc-400 dark:text-[#999999]" />
                <span className="font-serif text-2xl font-bold leading-none text-zinc-900 dark:text-white">
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
      </div>
    </motion.div>
  );
}