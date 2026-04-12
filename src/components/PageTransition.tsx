"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const binaryChars = "01011001010110101011010101010101010101111110000";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isGlitching, setIsGlitching] = useState(true);
  const [binaryStrings, setBinaryStrings] = useState<string[]>([]);

  useEffect(() => {
    // Generate random strings once on mount to avoid hydration mismatch while still feeling fast
    const strings = Array.from({ length: 50 }).map(() => 
      Array.from({ length: 20 }).map(() => binaryChars[Math.floor(Math.random() * binaryChars.length)]).join("")
    );
    setBinaryStrings(strings);

    const timer = setTimeout(() => setIsGlitching(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full flex-1 flex flex-col">
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full flex-1 flex flex-col"
        style={{ filter: isGlitching ? "url(#page-glitch)" : "none" }}
      >
        {children}
      </motion.div>

      {/* Glitch Visual Overlays */}
      {isGlitching && (
        <>
          {/* RGB Split Emulation Layer */}
          <div className="fixed inset-0 z-[90] pointer-events-none bg-teal/5 mix-blend-screen opacity-30 animate-pulse" />
          
          {/* Binary Rain Flicker */}
          <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex flex-wrap gap-4 p-4 opacity-30">
            {binaryStrings.map((str, i) => (
              <div 
                key={i} 
                className="text-[0.6rem] font-mono text-teal tracking-[0.2em] whitespace-nowrap animate-binary"
                style={{ animationDelay: `${Math.random() * 0.2}s` }}
              >
                {str}
              </div>
            ))}
          </div>

          {/* Matrix Green Overlay - Matrix Green #00FF41 matches user request */}
          <div className="fixed inset-0 z-[95] pointer-events-none bg-[#00FF41]/5 shadow-[inset_0_0_100px_rgba(0,255,65,0.1)]" />
          
          <div className="scanline-overlay" />
        </>
      )}

      {/* SVG Animation Driver */}
      <motion.div
        className="hidden"
        initial={{ scale: 50, opacity: 0.05 } as any}
        animate={{ scale: 0, opacity: 0.01 } as any}
        transition={{ duration: 0.4, ease: "circOut" }}
        onUpdate={(latest) => {
          const filter = typeof document !== 'undefined' ? document.getElementById("page-glitch") : null;
          if (filter) {
            const map = filter.querySelector("feDisplacementMap");
            const turb = filter.querySelector("feTurbulence");
            if (map) map.setAttribute("scale", (latest.scale as number).toString());
            if (turb) turb.setAttribute("baseFrequency", (latest.opacity as number).toString());
          }
        }}
      />
    </div>
  );
}
