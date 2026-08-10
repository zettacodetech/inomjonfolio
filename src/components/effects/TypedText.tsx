"use client";

import { useEffect, useRef, useState } from "react";

export function TypedText({ words, className }: { words: string[]; className?: string }) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    const speed = deleting ? 40 : 95;

    timeoutRef.current = setTimeout(
      () => {
        if (!deleting) {
          const next = word.slice(0, text.length + 1);
          setText(next);
          if (next === word) setTimeout(() => setDeleting(true), 1600);
        } else {
          const next = word.slice(0, text.length - 1);
          setText(next);
          if (next === "") {
            setDeleting(false);
            setWordIndex((i) => i + 1);
          }
        }
      },
      deleting ? speed : text.length === 0 ? 500 : speed
    );

    return () => clearTimeout(timeoutRef.current);
  }, [text, deleting, wordIndex, words]);

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse text-[#999999]">|</span>
    </span>
  );
}