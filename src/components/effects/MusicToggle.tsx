"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Music2, Volume2, VolumeX } from "lucide-react";

export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/ambient.wav");
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="flex items-center gap-1">
      {playing && (
        <button
          onClick={toggleMute}
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-900/8 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      )}
      <button
        onClick={togglePlay}
        className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-900/8 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
        aria-label="Background music"
      >
        {playing ? <Music2 size={15} className={muted ? "text-zinc-300" : "text-[#999999]"} /> : <Music size={15} />}
      </button>
    </div>
  );
}