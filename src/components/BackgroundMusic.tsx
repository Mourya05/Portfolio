"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.2; // Optional: lower volume so it's not too loud

    // Try to play immediately
    audio.play().catch(e => console.log("Audio play failed:", e));
  }, []);

  return <audio ref={audioRef} src="/bgmusic.mp3" loop autoPlay className="hidden" />;
}
