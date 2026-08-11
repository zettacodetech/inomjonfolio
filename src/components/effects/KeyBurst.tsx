"use client";

import { useEffect } from "react";

export function KeyBurst() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (e.key.toLowerCase() !== "i") return;
      window.dispatchEvent(
        new CustomEvent("burst-confetti", {
          detail: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
        })
      );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}