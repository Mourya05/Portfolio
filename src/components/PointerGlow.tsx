"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function PointerGlow() {
  const ringRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const pos      = useRef({ x: -200, y: -200 });
  const smooth   = useRef({ x: -200, y: -200 });
  const raf      = useRef<number>(0);
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);

  /* ── Move handler (raw, no state) ──────────────────────────────────── */
  const onMove = useCallback((e: MouseEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };

    // Dot snaps instantly
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
    // Page glow follows raw
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(0,229,255,0.045), transparent 80%)`;
    }
  }, []);

  /* ── Hover detection ───────────────────────────────────────────────── */
  const onOver = useCallback((e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest(
      "a, button, [role=button], input, textarea, select, label, [data-cursor]"
    );
    setIsHover(!!el);
  }, []);

  /* ── Click flash ───────────────────────────────────────────────────── */
  const onClick = useCallback(() => {
    setIsClick(true);
    setTimeout(() => setIsClick(false), 150);
  }, []);

  /* ── RAF: smooth ring follows with lag ─────────────────────────────── */
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      smooth.current.x = lerp(smooth.current.x, pos.current.x, 0.50);
      smooth.current.y = lerp(smooth.current.y, pos.current.y, 0.50);

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${smooth.current.x}px, ${smooth.current.y}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  /* ── Global event listeners + hide native cursor ───────────────────── */
  useEffect(() => {
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("click",     onClick);

    // Inject a global style tag to guarantee cursor:none everywhere
    const style = document.createElement("style");
    style.id    = "custom-cursor-hide";
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("click",     onClick);
      document.getElementById("custom-cursor-hide")?.remove();
    };
  }, [onMove, onOver, onClick]);

  /* ── Derived sizes / colours ────────────────────────────────────────── */
  const ringSize  = isHover ? 44 : 32;
  const color     = isHover ? "#A18AFF" : "#00E5FF";
  const colorRgb  = isHover ? "161,138,255" : "0,229,255";
  const dotSize   = isClick ? 10 : isHover ? 7 : 5;

  return (
    <>
      {/* ── Ambient page glow ──────────────────────────────────────────── */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-20 transition-none"
      />

      {/* ── Lagging outer ring ─────────────────────────────────────────── */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{ transform: "translate(-200px,-200px)" }}
      >
        <div
          style={{
            position:     "absolute",
            width:        ringSize,
            height:       ringSize,
            top:          -ringSize / 2,
            left:         -ringSize / 2,
            borderRadius: "50%",
            border:       `1.5px solid rgba(${colorRgb},0.75)`,
            boxShadow:    `0 0 14px rgba(${colorRgb},0.35), inset 0 0 6px rgba(${colorRgb},0.1)`,
            transition:   "width .25s ease,height .25s ease,border-color .25s ease,box-shadow .25s ease,top .25s ease,left .25s ease",
          }}
        />
      </div>

      {/* ── Instant-snap center dot ────────────────────────────────────── */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{ transform: "translate(-200px,-200px)" }}
      >
        <div
          style={{
            position:     "absolute",
            width:        dotSize,
            height:       dotSize,
            top:          -dotSize / 2,
            left:         -dotSize / 2,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow:    `0 0 ${isClick ? "18px 4px" : "8px 2px"} rgba(${colorRgb},0.9)`,
            transition:   "width .15s ease,height .15s ease,top .15s ease,left .15s ease,background-color .2s ease,box-shadow .15s ease",
          }}
        />
      </div>
    </>
  );
}
