"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5; // Optional: lower volume so it's not too loud

    // Try to play immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented. Wait for first user interaction.
        const playOnInteract = () => {
          audio.play().catch(e => console.log("Audio play failed:", e));
          ["click", "keydown", "touchstart"].forEach(event => 
            document.removeEventListener(event, playOnInteract)
          );
        };
        
        ["click", "keydown", "touchstart"].forEach(event => 
          document.addEventListener(event, playOnInteract, { once: true })
        );
      });
    }
  }, []);

  return <audio ref={audioRef} src="/bgmusic.mp3" loop autoPlay className="hidden" />;
}
