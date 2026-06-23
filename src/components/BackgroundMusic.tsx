"use client";

import { useEffect, useRef, useState } from "react";

const MUSIC_ENABLED = true; // Set to true to enable background music

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Unlock + start on first user gesture
  useEffect(() => {
    const unlock = () => {
      if (unlocked) return;
      setUnlocked(true);
      if (!MUSIC_ENABLED) return; // Skip autoplay if disabled
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = 0.2;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [unlocked]);

  const toggle = () => {
    if (!MUSIC_ENABLED) return; // Prevent toggle if disabled
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgmusic.mp3" loop className="hidden" />

      {/* Floating music toggle button */}
      <button
        onClick={toggle}
        title={playing ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-teal/40 transition-all duration-300 group"
        style={{ boxShadow: playing ? "0 0 14px rgba(0,229,255,0.25)" : "none" }}
      >
        {playing ? (
          /* Pause icon — two bars */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="3.5" height="10" rx="1" fill="#00E5FF" />
            <rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="#00E5FF" />
          </svg>
        ) : (
          /* Play icon — triangle */
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 2L12 7L3 12V2Z" fill="#94A3B8" />
          </svg>
        )}

        {/* Animated equalizer bars when playing */}
        {playing && (
          <span className="absolute -top-1 -right-1 flex gap-[2px] items-end h-3">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-teal"
                style={{
                  height: `${4 + i * 3}px`,
                  animation: `eq-bounce ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </span>
        )}
      </button>

      <style>{`
        @keyframes eq-bounce {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
