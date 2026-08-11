"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        setProgress(p);
        setVisible(window.scrollY > 600);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-[65] flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg ring-1 ring-black/10 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(153,153,153,0.35)] dark:bg-white/[0.06] dark:ring-white/15 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <svg
        aria-hidden
        className="absolute inset-0 -rotate-90"
        width="48"
        height="48"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="2.5"
          className="stroke-zinc-200 dark:stroke-white/10"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="stroke-[#999999] transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      <ArrowUp size={16} className="text-zinc-600 dark:text-zinc-300" />
    </button>
  );
}