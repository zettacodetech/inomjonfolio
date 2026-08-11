"use client";

import { motion, type Transition } from "framer-motion";
import { Database, GitPullRequest, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

const ft = (delay = 0): Transition => ({ duration: 0.5, ease: "easeOut", delay });

const icons = [Database, GitPullRequest, LayoutDashboard];

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    { title: t.serviceBackendTitle, desc: t.serviceBackendDesc },
    { title: t.serviceApiTitle, desc: t.serviceApiDesc },
    { title: t.serviceDashTitle, desc: t.serviceDashDesc },
  ];

  return (
    <section className="mt-24">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={ft(0)}
        className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500"
      >
        {t.servicesLabel}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={ft(0.07)}
        className="mt-3 font-serif text-3xl font-bold text-zinc-900 dark:text-white"
      >
        {t.servicesHeadline}
      </motion.h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={ft(0.08 * index)}
              className="card-luxe shine group relative overflow-hidden rounded-3xl p-7"
            >
              <div className="orb -right-14 -top-14 h-36 w-36 bg-[#999999]/15 dark:bg-[#999999]/10" />

              {/* Number watermark */}
              <span className="absolute -right-1 -top-3 select-none font-serif text-7xl font-black leading-none text-black/[0.04] transition-colors group-hover:text-black/[0.07] dark:text-white/[0.04] dark:group-hover:text-[#999999]/[0.08]">
                0{index + 1}
              </span>

              <div className="ring-chrome relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 dark:border-white/[0.08] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                <Icon size={20} className="text-zinc-500 transition-colors group-hover:text-[#999999] dark:text-zinc-400" />
              </div>

              <h3 className="relative z-10 mt-5 font-serif text-xl font-bold text-zinc-900 transition-colors group-hover:text-[#999999] dark:text-white">
                {service.title}
              </h3>
              <p className="relative z-10 mt-2.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {service.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}