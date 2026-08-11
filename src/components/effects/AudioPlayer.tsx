"use client";

import { useCallback, useEffect, useRef } from "react";

const TRACKS = [
  "/ambient.wav",
  "/ambient-dream.wav",
  "/ambient-focus.wav",
  "/ambient-night.wav",
];

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);

  const playCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {});
  }, []);

  const playNext = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    indexRef.current = (indexRef.current + 1) % TRACKS.length;
    audio.src = TRACKS[indexRef.current];
    audio.play().catch(() => {});
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    audio.volume = 0.28;
    audio.loop = false;
    audioRef.current = audio;

    const onEnded = () => playNext();
    audio.addEventListener("ended", onEnded);

    const onVisibility = () => {
      if (!document.hidden) resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Browsers block autoplay with sound until the first user interaction.
    // Try immediately; if rejected, every first-of-kind interaction retries.
    playCurrent();
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((event) =>
      window.addEventListener(event, resume, { once: true, passive: true })
    );

    return () => {
      events.forEach((event) => window.removeEventListener(event, resume));
      document.removeEventListener("visibilitychange", onVisibility);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [playCurrent, playNext, resume]);

  return null;
}