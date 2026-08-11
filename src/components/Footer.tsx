"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { socialLinks } from "@/lib/portfolio-data";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 mt-8 border-t border-black/[0.07] dark:border-white/[0.06]">
      {/* Silver top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#999999]/40 to-transparent" />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
              Inomjon{" "}
              <span className="text-zinc-400 dark:text-[#999999]">Toshmirzayev</span>
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
              Backend Developer
            </p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {[
              { href: socialLinks.github, icon: Github, label: "GitHub" },
              { href: socialLinks.linkedin, icon: Linkedin, label: "LinkedIn" },
              { href: socialLinks.telegram, icon: Send, label: "Telegram" },
              { href: socialLinks.email, icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="ring-chrome flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition-all hover:-translate-y-1 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-500 dark:hover:text-white"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-black/[0.06] dark:bg-white/[0.05]" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-zinc-400 dark:text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Inomjon Toshmirzayev. Barcha huquqlar himoyalangan.</p>
          <Link
            href="/"
            className="rounded-full px-3 py-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-300"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </footer>
  );
}