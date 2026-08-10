"use client";

import type { ReactNode } from "react";

export function Marquee({
  children,
  className,
  speed = 30,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <div
      className={`relative flex overflow-hidden ${className ?? ""}`}
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex shrink-0 items-center gap-3 pr-3"
        style={{ animation: `marqueeScroll ${speed}s linear infinite` }}
      >
        {children}
      </div>
      <div
        className="flex shrink-0 items-center gap-3 pr-3"
        style={{ animation: `marqueeScroll ${speed}s linear infinite` }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}