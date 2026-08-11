"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 900);
    const t2 = setTimeout(() => setDone(true), 1600);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  if (done) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-white dark:bg-[#050505]"
        >
          {/* Rotating silver ring */}
          <div className="relative h-24 w-24">
            <div className="animate-spin h-full w-full rounded-full border-2 border-transparent border-t-[#999999] border-r-[#999999]/40 border-b-[#999999]/10 border-l-transparent" />
            <div
              className="animate-spin absolute inset-3 rounded-full border-2 border-transparent border-r-[#999999]/60 border-b-[#999999]/20"
              style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
            />
            <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#999999] shadow-[0_0_18px_rgba(153,153,153,0.8)]" />
          </div>
          <p className="absolute bottom-[38%] text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-400 dark:text-zinc-600">
            Loading
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}