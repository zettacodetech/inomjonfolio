"use client";

import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail, Send } from "lucide-react";
import { motion, type Transition } from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { socialLinks } from "@/lib/portfolio-data";
import { TypedText } from "@/components/effects/TypedText";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { Hero3D } from "@/components/effects/Hero3D";

const ft = (delay = 0): Transition => ({ duration: 0.55, ease: "easeOut", delay });

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="relative flex flex-col justify-center">
      <Hero3D />

      {/* Halo orbs behind hero text */}
      <div className="orb -left-24 top-0 h-72 w-72 bg-[#999999]/20 dark:bg-[#999999]/15" />
      <div className="orb right-0 top-1/3 h-56 w-56 bg-zinc-300/20 dark:bg-[#999999]/10" />

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ft(0.08)}
        className="relative font-serif text-6xl font-bold leading-[1.05] tracking-tight text-zinc-900 dark:text-white sm:text-7xl lg:text-8xl"
      >
        {t.heroTitle1}
        <br />
        <span className="text-zinc-400 dark:text-holo">{t.heroTitle2}</span>
      </motion.h1>

      {/* Subtitle — typed effect */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ft(0.16)}
        className="relative mt-5 flex items-center gap-3 text-base font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-[#999999]"
      >
        <span className="inline-block h-px w-10 bg-zinc-300 dark:bg-[#999999]/60" />
        <TypedText words={[t.heroSubtitle]} />
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ft(0.22)}
        className="relative mt-5 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400"
      >
        {t.heroDesc}
      </motion.p>

      {/* CTA buttons — magnetic */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ft(0.3)}
        className="relative mt-8 flex flex-wrap gap-3"
      >
        <MagneticButton>
          <Link
            href="/projects"
            className="shine relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-700 active:scale-95 dark:bg-gradient-to-b dark:from-white dark:to-zinc-200 dark:text-black dark:hover:from-zinc-50 dark:hover:to-zinc-300"
          >
            {t.viewProjects}
            <ArrowRight size={15} />
          </Link>
        </MagneticButton>
        <MagneticButton strength={0.25}>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-[#999999]/60 hover:bg-zinc-100 hover:shadow-[0_0_24px_rgba(153,153,153,0.2)] active:scale-95 dark:border-white/10 dark:text-white dark:hover:bg-white/5 dark:hover:shadow-[0_0_24px_rgba(153,153,153,0.15)]"
          >
            {t.learnMore}
          </Link>
        </MagneticButton>
        <MagneticButton strength={0.3}>
          <a
            href="/inomjon-cv.pdf"
            download="Inomjon-Toshmirzayev-CV.pdf"
            className="ring-chrome inline-flex items-center gap-2 rounded-full border border-[#999999]/50 px-6 py-2.5 text-sm font-semibold text-[#777] transition-all hover:border-[#999999] hover:text-zinc-900 hover:shadow-[0_0_28px_rgba(153,153,153,0.35)] active:scale-95 dark:text-[#999999] dark:hover:text-white"
          >
            <Download size={14} />
            {t.downloadCv}
          </a>
        </MagneticButton>
      </motion.div>

      {/* Social links — chrome rings */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ft(0.38)}
        className="relative mt-8 flex items-center gap-3"
      >
        {[
          { href: socialLinks.github, icon: Github, label: "GitHub" },
          { href: socialLinks.linkedin, icon: Linkedin, label: "LinkedIn" },
          { href: socialLinks.telegram, icon: Send, label: "Telegram" },
          { href: socialLinks.email, icon: Mail, label: "Email" },
        ].map(({ href, icon: Icon, label }) => (
          <MagneticButton key={label} strength={0.4}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="ring-chrome flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-all hover:-translate-y-0.5 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-500 dark:hover:text-white"
            >
              <Icon size={15} />
            </a>
          </MagneticButton>
        ))}
      </motion.div>
    </div>
  );
}