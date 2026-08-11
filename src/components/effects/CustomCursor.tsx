"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let hover = false;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement;
      hover = Boolean(target.closest("a, button, [data-cursor]"));
      document.documentElement.classList.toggle("custom-cursor-hover", hover);
    };

    const loop = () => {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - 17}px, ${ry - 17}px, 0)`;
        ringRef.current.style.scale = hover ? "1.6" : "1";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("custom-cursor-active", "custom-cursor-hover");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-1.5 w-1.5 rounded-full bg-[#999999] shadow-[0_0_10px_rgba(153,153,153,0.9)] transition-transform dark:block"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[34px] w-[34px] rounded-full border border-[#999999]/50 transition-[scale] duration-300 dark:block"
      />
    </>
  );
}