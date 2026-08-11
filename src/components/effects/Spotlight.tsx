"use client";

import { useEffect } from "react";

export function Spotlight() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".card-luxe");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}