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
  const startedRef = useRef(false);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || startedRef.current) return;
    startedRef.current = true;
    audio.play().catch(() => {});
  }, []);

  const playNext = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    indexRef.current = (indexRef.current + 1) % TRACKS.length;
    audio.src = TRACKS[indexRef.current];
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    audio.volume = 0.22;
    audio.loop = false;
    audioRef.current = audio;

    const onEnded = () => playNext();
    audio.addEventListener("ended", onEnded);

    // Browsers block autoplay with sound until the first user interaction.
    // Try immediately; if blocked, start on the first interaction of any kind.
    start();
    const resume = () => start();
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    events.forEach((event) => window.addEventListener(event, resume, { once: true, passive: true }));
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) start();
    });

    return () => {
      events.forEach((event) => window.removeEventListener(event, resume));
      document.removeEventListener("visibilitychange", () => {});
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [playNext, start]);

  return null;
}