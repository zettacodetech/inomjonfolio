"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function Aurora() {
  return (
    <div aria-hidden className="aurora hidden dark:block">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  );
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-[3px] z-[61] h-[2px] origin-left bg-gradient-to-r from-[#999999]/10 via-[#999999] to-[#999999]/10"
    />
  );
}