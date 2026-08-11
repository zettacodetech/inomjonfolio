"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tilt3D } from "@/components/effects/Tilt3D";
import { MagneticButton } from "@/components/effects/MagneticButton";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="orb -left-24 top-1/4 h-72 w-72 bg-[#999999]/20 dark:bg-[#999999]/15" />
      <div className="orb right-0 bottom-1/4 h-56 w-56 bg-zinc-300/20 dark:bg-[#999999]/10" />

      <Tilt3D max={18} className="[perspective:1000px]">
        <div className="relative flex flex-col items-center">
          <div
            className="font-serif text-[8rem] font-black leading-none sm:text-[11rem]"
            style={{
              background:
                "linear-gradient(130deg, #f0f0f0 0%, #999999 24%, #fafafa 48%, #777 68%, #e8e8e8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(153,153,153,0.35))",
            }}
          >
            404
          </div>
          <div className="card-luxe shine relative -mt-10 overflow-hidden rounded-3xl px-10 py-8 text-center">
            <p className="relative z-10 font-serif text-2xl font-bold text-zinc-900 dark:text-white">
              Sahifa topilmadi
            </p>
            <p className="relative z-10 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Siz noto'g'ri manzilga keldingiz. Bosh sahifaga qayting.
            </p>
            <div className="relative z-10 mt-6">
              <MagneticButton>
                <Link
                  href="/"
                  className="shine inline-flex items-center gap-2 overflow-hidden rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-95 dark:bg-gradient-to-b dark:from-white dark:to-zinc-200 dark:text-black"
                >
                  <ArrowLeft size={15} />
                  Bosh sahifaga
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </Tilt3D>
    </main>
  );
}