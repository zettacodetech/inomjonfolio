"use client";

import { Github, Linkedin, Mail, Send } from "lucide-react";
import { socialLinks } from "@/lib/portfolio-data";

export function SocialSidebar() {
  const links = [
    { href: socialLinks.github, icon: Github, label: "GitHub" },
    { href: socialLinks.telegram, icon: Send, label: "Telegram" },
    { href: socialLinks.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: socialLinks.email, icon: Mail, label: "Email" },
  ];

  return (
    <div className="fixed bottom-0 left-7 z-[60] hidden flex-col items-center gap-5 lg:flex">
      <div className="flex flex-col items-center gap-4">
        {links.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-[#999999]/50 hover:text-zinc-900 hover:shadow-[0_0_24px_rgba(153,153,153,0.25)] dark:border-white/10 dark:text-zinc-500 dark:hover:text-white"
          >
            <Icon size={15} />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-600 opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100 dark:border-white/10 dark:bg-[#131316] dark:text-zinc-300">
              {label}
            </span>
          </a>
        ))}
      </div>
      <span className="h-20 w-px bg-gradient-to-b from-[#999999]/40 to-transparent" />
    </div>
  );
}