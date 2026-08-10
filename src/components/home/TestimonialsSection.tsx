"use client";

import { motion, type Transition } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import type { TestimonialView } from "@/lib/data";

const ft = (delay = 0): Transition => ({ duration: 0.5, ease: "easeOut", delay });

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialView[] }) {
  const { t } = useLanguage();

  if (testimonials.length === 0) return null;

  return (
    <section className="mt-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={ft(0)}
        className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500"
      >
        {t.testimonialsLabel}
      </motion.p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={ft(0.07 * index)}
            className="flex flex-col rounded-3xl border border-black/[0.08] bg-white p-6 shadow-sm dark:border-white/[0.07] dark:bg-[#111111] dark:shadow-none"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < item.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-300 dark:text-zinc-700"
                  }
                />
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              "{item.text}"
            </p>
            <div className="mt-4">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.author}</p>
              {item.role && <p className="mt-0.5 text-xs text-zinc-400">{item.role}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}