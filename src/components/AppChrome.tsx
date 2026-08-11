"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VisitTracker } from "@/components/VisitTracker";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { Particles } from "@/components/effects/Particles";
import { StarField } from "@/components/effects/StarField";
import { Confetti } from "@/components/effects/Confetti";
import { Preloader } from "@/components/effects/Preloader";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { AudioPlayer } from "@/components/effects/AudioPlayer";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/inomjon0751" || pathname.startsWith("/inomjon0751/");

  return (
    <>
      {!isAdminRoute && (
        <>
          <Navbar />
          <VisitTracker />
          <ScrollProgress />
          <MouseGlow />
          <CustomCursor />
          <AudioPlayer />
          <Particles />
          <StarField />
          <Confetti />
          <Preloader />
        </>
      )}
      {isAdminRoute ? (
        children
      ) : (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex min-h-screen flex-col"
        >
          <div className="flex-1">{children}</div>
          <Footer />
        </motion.div>
      )}
    </>
  );
}