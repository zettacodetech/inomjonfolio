"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import type { Lang } from "@/lib/i18n";
import { MusicToggle } from "@/components/effects/MusicToggle";

const LANG_VALUES: Lang[] = ["en", "uz", "ru"];
const THEME_OPTIONS = [
  { key: "system", label: "Auto", icon: Monitor },
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme, theme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/projects", label: t.projects },
    { href: "/blog", label: t.blogLabel },
    { href: "/contact", label: t.contact },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-4 z-50 flex justify-center px-4 transition-all duration-500 ${
        scrolled ? "top-2" : "top-4"
      }`}
    >
      <nav
        className={`ring-chrome flex items-center gap-1 rounded-full border px-4 py-2 transition-all duration-500 ${
          scrolled
            ? "border-black/15 bg-white/85 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-[#0d0d0d]/85 dark:shadow-2xl"
            : "border-black/10 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/60"
        }`}
      >
        {/* Nav links */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "text-zinc-500 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white dark:hover:text-[#999999]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Controls */}
        <div className="ml-4 flex items-center gap-1">
          {mounted && <MusicToggle />}
          {mounted && (
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-900/8 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              </button>
              {themeOpen && (
                <div className="absolute right-0 top-10 min-w-[96px] overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                  {THEME_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = theme === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setTheme(opt.key);
                          setThemeOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                          active
                            ? "bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white"
                            : "text-zinc-500 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                      >
                        <Icon size={12} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Language dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-8 min-w-[2.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-zinc-900/8 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {lang.toUpperCase()}
            </button>
            {open && (
              <div className="absolute right-0 top-10 min-w-[80px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                {LANG_VALUES.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                      lang === l
                        ? "bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white"
                        : "text-zinc-500 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
