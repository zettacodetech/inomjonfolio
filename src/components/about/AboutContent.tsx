"use client";

import Image from "next/image";
import { Briefcase, MapPin, Star } from "lucide-react";
import { motion, type Transition } from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import type { PortfolioStatsView, SkillView, ExperienceView, TestimonialView } from "@/lib/data";
import { AnimatedCounter } from "@/components/effects/AnimatedCounter";
import { Marquee } from "@/components/effects/Marquee";

const fadeTransition = (delay = 0): Transition => ({
  duration: 0.55,
  ease: "easeOut",
  delay,
});

type Props = {
  stats: PortfolioStatsView;
  skills: SkillView[];
  experience: ExperienceView[];
  testimonials: TestimonialView[];
};

export function AboutContent({ stats, skills, experience, testimonials }: Props) {
  const { t } = useLanguage();
  const expYears = stats.experience_years;
  const projectCount = stats.project_count;

  const skillsByGroup = skills.reduce<Record<string, SkillView[]>>((acc, skill) => {
    const group = skill.group ?? "Tooling";
    (acc[group] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-16">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition(0)}
            className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500"
          >
            {t.aboutLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition(0.07)}
            className="mt-4 font-serif text-4xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-5xl"
          >
            Inomjon Toshmirzayev
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition(0.14)}
            className="mt-6 text-sm leading-7 text-zinc-500 dark:text-zinc-400"
          >
            {t.aboutDesc}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition(0.2)}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { value: expYears, suffix: "+", label: t.yearsExp },
              { value: projectCount, suffix: "+", label: t.projectsDone },
              { value: stats.happy_clients_count, suffix: "+", label: t.happyClients },
            ].map(({ value, suffix, label }) => (
              <div
                key={label}
                className="card-luxe shine group relative overflow-hidden rounded-2xl p-5"
              >
                <div className="orb -right-10 -top-10 h-28 w-28 bg-[#999999]/15 dark:bg-[#999999]/10" />
                <AnimatedCounter
                  value={value}
                  suffix={suffix}
                  className="relative z-10 font-serif text-4xl font-bold text-zinc-900 transition-colors group-hover:text-[#999999] dark:text-white"
                />
                <p className="relative z-10 mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Tech marquee */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition(0.27)}
            className="mt-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              {t.techStackLabel}
            </p>
            <Marquee className="mt-4" speed={34}>
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="chip-3d shrink-0 px-4 py-2 text-xs"
                >
                  {skill.name}
                </span>
              ))}
            </Marquee>
          </motion.div>

          {/* Skills grouped */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeTransition(0.3)}
            className="mt-10 space-y-6"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              {t.techStackLabel}
            </p>
            {Object.entries(skillsByGroup).map(([group, items]) => (
              <div key={group}>
                <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill.id}
                      className="chip-3d px-3.5 py-1.5 text-xs"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: profile image card */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 } as Transition}
          className="flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-[300px] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-md dark:border-white/[0.07] dark:bg-[#111111] dark:shadow-2xl">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <Image
                src="/uploads/profile-inomjon.webp"
                alt="Inomjon Toshmirzayev"
                fill
                className="object-cover object-top"
                sizes="300px"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent dark:from-[#111111]" />
            </div>
            <div className="px-5 pb-5 pt-1">
              <p className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">
                Inomjon Toshmirzayev
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                <MapPin size={11} />
                Qashqadaryo, Uzbekistan
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Experience timeline */}
      {experience.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
            {t.workExperience}
          </p>
          <div className="relative space-y-8 pl-6">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-200 dark:bg-white/10" />
            {experience.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="relative"
              >
                <span className="absolute -left-6 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-zinc-300 bg-white ring-chrome dark:border-white/20 dark:bg-[#1a1a1a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 dark:bg-[#999999]" />
                </span>
                <div className="card-luxe shine rounded-2xl p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Briefcase size={13} className="text-zinc-400 dark:text-[#999999]" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{item.role}</h3>
                    <span className="chip-3d px-2.5 py-0.5 text-[10px] font-semibold">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.company}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <motion.section>
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
            {t.testimonialsLabel}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="card-luxe shine group relative flex flex-col overflow-hidden rounded-2xl p-5"
              >
                <div className="orb -right-12 -top-12 h-32 w-32 bg-[#999999]/15 dark:bg-[#999999]/10" />
                <div className="relative z-10 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < item.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"}
                    />
                  ))}
                </div>
                <p className="relative z-10 mt-3 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">"{item.text}"</p>
                <div className="relative z-10 mt-4">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.author}</p>
                  {item.role && <p className="text-xs text-zinc-400">{item.role}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}