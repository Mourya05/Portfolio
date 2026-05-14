"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── types ────────────────────────────────────────────────────────────────────
interface SkillCategory {
  label: string;
  tag: string;
  items: string[];
  color: string;
}

export interface CapabilitySkillData {
  reg: string;
  title: string;
  accent: string;
  categories: SkillCategory[];
}

interface Props {
  data: CapabilitySkillData | null;
  onClose: () => void;
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function useTypedLines(lines: string[], speed = 18, open = false) {
  const [revealed, setRevealed] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) { setRevealed([]); return; }
    setRevealed([]);
    let idx = 0;
    const tick = () => {
      if (idx >= lines.length) return;
      setRevealed(prev => [...prev, lines[idx]]);
      idx++;
      timerRef.current = setTimeout(tick, speed + Math.random() * 30);
    };
    timerRef.current = setTimeout(tick, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, lines.join("|"), speed]);

  return revealed;
}

// ─── Scanline canvas overlay ──────────────────────────────────────────────────
function Scanlines({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${color}08 3px, ${color}08 4px)`,
      }}
    />
  );
}

// ─── Blinking cursor ──────────────────────────────────────────────────────────
function Cursor({ color }: { color: string }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVis(v => !v), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="inline-block w-2 h-4 ml-1 align-middle"
      style={{ background: vis ? color : "transparent", boxShadow: vis ? `0 0 8px ${color}` : "none" }}
    />
  );
}

// ─── Boot header lines ────────────────────────────────────────────────────────
const BOOT_HEADER = [
  "SKILL_REGISTRY v3.1 — INITIALIZING",
  "Loading capability manifest...",
  "[ OK ] Authentication passed",
  "[ OK ] Sector map resolved",
  "Mounting skill modules...",
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function SkillLogOverlay({ data, onClose }: Props) {
  const isOpen = data !== null;

  // Play window.mp3 (first 3 s at 1.5×) whenever the overlay opens
  useEffect(() => {
    if (!isOpen) return;
    const audio = new Audio("/window.mp3");
    audio.playbackRate = 1.5;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    const stop = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);
    return () => {
      clearTimeout(stop);
      audio.pause();
    };
  }, [isOpen]);

  // Build a flat list of boot header + skill log lines
  const allLines: { text: string; type: "boot" | "section" | "skill" | "sep" }[] =
    data
      ? [
          ...BOOT_HEADER.map(t => ({ text: t, type: "boot" as const })),
          { text: `━━━ MODULE: ${data.reg} ━━━`, type: "sep" as const },
          ...data.categories.flatMap(cat => [
            { text: `  ▸ [${cat.tag}] ${cat.label.toUpperCase()}`, type: "section" as const },
            ...cat.items.map(item => ({ text: `      └─ ${item}`, type: "skill" as const })),
          ]),
          { text: "━━━ EOF — ALL MODULES LOADED ━━━", type: "sep" as const },
        ]
      : [];

  const lineTexts = allLines.map(l => l.text);
  const revealed = useTypedLines(lineTexts, 22, isOpen);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const accent = data?.accent ?? "#00E5FF";

  return (
    <AnimatePresence>
      {isOpen && data && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-obsidian/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scaleY: 0.04, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleY: 0.04, scaleX: 0.7 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 pt-20 pb-20 sm:px-8 sm:pt-24 sm:pb-20 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-full rounded-2xl border flex flex-col overflow-hidden pointer-events-auto"
              style={{
                background: `radial-gradient(ellipse at top left, ${accent}0A 0%, #050508 60%)`,
                borderColor: `${accent}40`,
                boxShadow: `0 0 60px ${accent}22, inset 0 0 40px ${accent}08`,
              }}
            >
              <Scanlines color={accent} />

              {/* Window chrome / title bar */}
              <div
                className="flex items-center justify-between px-5 py-3 border-b shrink-0 relative z-10"
                style={{ borderColor: `${accent}30`, background: `${accent}08` }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span
                    className="font-mono text-[9px] tracking-[0.25em] uppercase"
                    style={{ color: accent, textShadow: `0 0 10px ${accent}` }}
                  >
                    SKILL_LOG :: {data.reg}
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="font-mono text-[10px] tracking-widest transition-all duration-200 px-2 py-0.5 rounded border"
                  style={{
                    color: `${accent}80`,
                    borderColor: `${accent}20`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = accent;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}60`;
                    (e.currentTarget as HTMLButtonElement).style.textShadow = `0 0 12px ${accent}`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = `${accent}80`;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}20`;
                    (e.currentTarget as HTMLButtonElement).style.textShadow = "";
                  }}
                >
                  [ESC] CLOSE
                </button>
              </div>

              {/* Log body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 font-mono text-[11px] sm:text-xs leading-relaxed relative z-10">
                {allLines.slice(0, revealed.length).map((line, i) => {
                  const isRevealed = i < revealed.length;
                  const isLast = i === revealed.length - 1;

                  let color = "#94A3B8"; // default ash
                  if (line.type === "boot") color = accent;
                  if (line.type === "sep") color = `${accent}CC`;
                  if (line.type === "section") color = "#A18AFF";
                  if (line.type === "skill") color = "#E2E8F0";

                  // Detect [ OK ] for green highlight
                  const isOk = line.text.startsWith("[ OK ]");
                  if (isOk) color = "#39FF14";

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: isRevealed ? 1 : 0, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-start gap-2 py-[2px]"
                    >
                      {/* Line gutter number */}
                      <span className="select-none w-6 text-right shrink-0" style={{ color: `${accent}30` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Line content */}
                      <span style={{ color, textShadow: (line.type === "sep" || isOk) ? `0 0 10px ${color}` : undefined }}>
                        {line.text}
                        {isLast && <Cursor color={accent} />}
                      </span>
                    </motion.div>
                  );
                })}

                {/* Show skill badges after all lines revealed */}
                {revealed.length === allLines.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 pt-4 border-t"
                    style={{ borderColor: `${accent}20` }}
                  >
                    <p className="text-[9px] tracking-widest uppercase mb-3" style={{ color: `${accent}60` }}>
                      ▸ COMPILED SKILL TAGS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.categories.flatMap(cat =>
                        cat.items.map(item => (
                          <motion.span
                            key={`${cat.tag}-${item}`}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest font-mono border transition-all duration-200 cursor-default"
                            style={{
                              color: cat.color,
                              borderColor: `${cat.color}30`,
                              background: `${cat.color}08`,
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.background = `${cat.color}18`;
                              (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}60`;
                              (e.currentTarget as HTMLElement).style.textShadow = `0 0 10px ${cat.color}`;
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.background = `${cat.color}08`;
                              (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}30`;
                              (e.currentTarget as HTMLElement).style.textShadow = "";
                            }}
                          >
                            {item}
                          </motion.span>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Status bar */}
              <div
                className="px-5 py-2 border-t flex items-center justify-between shrink-0 relative z-10"
                style={{ borderColor: `${accent}20`, background: `${accent}06` }}
              >
                <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: `${accent}50` }}>
                  {revealed.length < allLines.length
                    ? `LOADING ${Math.round((revealed.length / allLines.length) * 100)}%...`
                    : "STATUS: ALL MODULES ONLINE"}
                </span>
                <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: `${accent}50` }}>
                  LINES: {revealed.length}/{allLines.length}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
