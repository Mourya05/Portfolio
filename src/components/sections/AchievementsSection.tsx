"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as THREE from "three";

/* ─── Mobile Detection ────────────────────────────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isMobile;
}

/* ─── Types & Data ────────────────────────────────────────────────────────── */
type Tier = "legendary" | "epic" | "rare";

interface Achievement {
  id: string;
  tier: Tier;
  category: string;
  categoryTag: string;
  title: string;
  org: string;
  metric: string;
  metricLabel: string;
  metricSub?: string;
  description: string;
  accent: string;
  accentRgb: string;
  icon: string;
  year: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "A_001", tier: "legendary",
    category: "National Competitive Exam", categoryTag: "GATE_CSE",
    title: "GATE 2026 — Computer Science", org: "IIT · GATE",
    metric: "9602", metricLabel: "All India Rank", metricSub: "AIR among 170,000+ candidates",
    description: "Secured AIR 9602 in GATE 2026 CSE — one of India's most competitive postgraduate engineering entrance examinations.",
    accent: "#FFD700", accentRgb: "255,215,0", icon: "🏛️", year: "2026",
  },
  {
    id: "A_002", tier: "legendary",
    category: "International Competition", categoryTag: "IEEE_XTREME",
    title: "IEEE Xtreme 18.0", org: "IEEE · Global",
    metric: "542", metricLabel: "Global Rank", metricSub: "#149 National · 5000+ teams worldwide",
    description: "Competed in IEEE Xtreme 18.0, a 24-hour global programming marathon. Ranked 542nd globally and 149th nationally.",
    accent: "#00E5FF", accentRgb: "0,229,255", icon: "🌐", year: "2024",
  },
  {
    id: "A_003", tier: "epic",
    category: "National Hackathon", categoryTag: "HACKATHON",
    title: "CTF Hackathon", org: "Supraja Technologies",
    metric: "🏆", metricLabel: "Best Student Award", metricSub: "Capture The Flag · Cybersecurity",
    description: "Awarded 'Best Student' at the CTF Hackathon — testing penetration testing, exploitation, and forensic analysis.",
    accent: "#FF4D4D", accentRgb: "255,77,77", icon: "🔐", year: "2025",
  },
  {
    id: "A_004", tier: "epic",
    category: "National Level", categoryTag: "MATH_COMP",
    title: "Ramanujan Mathematical Competition", org: "National · Srinivasa Ramanujan",
    metric: "TOP", metricLabel: "National Finalist", metricSub: "Srinivasa Ramanujan Mathematical Competition",
    description: "Advanced to the National Finalist stage — a proof-based competition testing number theory, combinatorics, and advanced problem-solving.",
    accent: "#A18AFF", accentRgb: "161,138,255", icon: "∑", year: "2024",
  },
  {
    id: "A_005", tier: "epic",
    category: "Agentic AI Hackathon", categoryTag: "AGENTATION",
    title: "Agentation 2025", org: "Malla Reddy University",
    metric: "FINL", metricLabel: "Finalist", metricSub: "Biggest Agentic AI Hackathon · India",
    description: "Selected as a Finalist in Agentation 2025 — the largest Agentic AI hackathon in India. Built an autonomous AI agent system.",
    accent: "#39FF14", accentRgb: "57,255,20", icon: "🤖", year: "2025",
  },
  {
    id: "A_006", tier: "rare",
    category: "Coding Challenge", categoryTag: "SMART_INT",
    title: "GCET-2027-R Coding Challenge", org: "Smart Interviews · GCET",
    metric: "1", metricLabel: "Rank 1", metricSub: "College-wide · Competitive Programming",
    description: "Secured Rank 1 in the Smart Interviews GCET-2027-R challenge — evaluating algorithmic problem-solving, data structures, and code efficiency.",
    accent: "#00E5FF", accentRgb: "0,229,255", icon: "💻", year: "2024",
  },
  {
    id: "A_007", tier: "rare",
    category: "Mathematics", categoryTag: "MATHS",
    title: "Tricky Maths Competition", org: "GCET · Internal",
    metric: "1", metricLabel: "Rank 1", metricSub: "College-wide · Mathematical Reasoning",
    description: "Secured Rank 1 in the Tricky Maths intra-college competition — testing rapid mathematical reasoning and mental arithmetic.",
    accent: "#A18AFF", accentRgb: "161,138,255", icon: "🧮", year: "2024",
  },
  {
    id: "A_008", tier: "rare",
    category: "Technical Event", categoryTag: "ALPHAMATICA",
    title: "Alphamatica 2024", org: "GCET · Technical Fest",
    metric: "2", metricLabel: "2nd Position", metricSub: "Technical Symposium · GCET",
    description: "Secured Second Position in Alphamatica 2024 — competing across algorithmic challenges and technical quizzes.",
    accent: "#FFA500", accentRgb: "255,165,0", icon: "⚡", year: "2024",
  },
];

const TIER_CONFIG: Record<
  Tier,
  { label: string; badge: string; badgeRgb: string; prefix: string; clearance: string; lightIntensity: number }
> = {
  legendary: { label: "LEGENDARY", badge: "#FFD700", badgeRgb: "255,215,0",   prefix: "◆", clearance: "ALPHA", lightIntensity: 3.5 },
  epic:      { label: "EPIC",      badge: "#A18AFF", badgeRgb: "161,138,255", prefix: "◈", clearance: "BETA",  lightIntensity: 2.5 },
  rare:      { label: "RARE",      badge: "#00E5FF", badgeRgb: "0,229,255",   prefix: "◇", clearance: "GAMMA", lightIntensity: 1.8 },
};

/* ─── Z-Arc Position Math ─────────────────────────────────────────────────── */
function getCardState(cardIdx: number, activeIdx: number) {
  const off   = cardIdx - activeIdx;
  const theta = off * 0.44;
  const R     = 7;
  return {
    x:       Math.sin(theta) * R,
    y:       0,
    z:       (Math.cos(theta) - 1) * R * 0.7,
    rotY:    -theta,
    blur:    Math.abs(off) === 0 ? 0 : Math.abs(off) === 1 ? 4 : Math.abs(off) === 2 ? 9 : 14,
    opacity: Math.max(0, 1 - Math.abs(off) * 0.22),
  };
}

/* ─── Animated Stat Counter ───────────────────────────────────────────────── */
function AnimatedStat({
  value,
  accent,
  accentRgb,
  run,
}: {
  value:     string;
  accent:    string;
  accentRgb: string;
  run:       boolean;
}) {
  const isNum   = /^\d+$/.test(value);
  const numPart = isNum ? parseInt(value, 10) : null;

  const mv     = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 42, damping: 13 });
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    if (isNum && run && numPart !== null) {
      mv.set(numPart);
    } else {
      mv.set(0);
    }
  }, [run, numPart, isNum, mv]);

  useEffect(() => {
    if (!isNum) return;
    const unsub = spring.on("change", (v) =>
      setDisplay(Math.round(v).toLocaleString())
    );
    return unsub;
  }, [spring, isNum]);

  return (
    <span
      style={{
        fontFamily:   "'Space Grotesk', sans-serif",
        fontWeight:   900,
        fontSize:     "clamp(2rem,5vw,3.4rem)",
        color:        accent,
        textShadow:   `0 0 30px rgba(${accentRgb},0.9), 0 0 60px rgba(${accentRgb},0.4)`,
        letterSpacing:"-0.03em",
        lineHeight:   1,
        display:      "inline-block",
      }}
    >
      {display}
    </span>
  );
}

/* ─── Individual 3D Card ──────────────────────────────────────────────────── */
function Card3D({
  ach,
  cardIdx,
  activeIdx,
  mousePos,
  onSelect,
}: {
  ach:      Achievement;
  cardIdx:  number;
  activeIdx:number;
  mousePos: { x: number; y: number };
  onSelect: () => void;
}) {
  const groupRef    = useRef<THREE.Group>(null);
  const isActive    = cardIdx === activeIdx;
  const state       = getCardState(cardIdx, activeIdx);
  const stateRef    = useRef(state);
  stateRef.current  = state;

  /* ── Set initial position so cards don't start stacked at origin ── */
  useEffect(() => {
    if (!groupRef.current) return;
    const s = getCardState(cardIdx, activeIdx);
    groupRef.current.position.set(s.x, 0, s.z);
    groupRef.current.rotation.y = s.rotY;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Lerp position each frame ── */
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const s = stateRef.current;
    groupRef.current.position.x  = THREE.MathUtils.lerp(groupRef.current.position.x,  s.x,    dt * 4.5);
    groupRef.current.position.z  = THREE.MathUtils.lerp(groupRef.current.position.z,  s.z,    dt * 4.5);
    groupRef.current.rotation.y  = THREE.MathUtils.lerp(groupRef.current.rotation.y,  s.rotY, dt * 4.5);
  });

  /* ── Glitch + counting state ── */
  const [glitching, setGlitching] = useState(false);
  const [counting,  setCounting]  = useState(false);
  const prevActive  = useRef(false);

  useEffect(() => {
    if (isActive && !prevActive.current) {
      setGlitching(true);
      const t1 = setTimeout(() => {
        setGlitching(false);
        setCounting(true);
        const t2 = setTimeout(() => setCounting(false), 1800);
        return () => clearTimeout(t2);
      }, 440);
      return () => clearTimeout(t1);
    }
    if (!isActive) { setCounting(false); setGlitching(false); }
    prevActive.current = isActive;
  }, [isActive]);

  /* ── Reverse parallax tilt (away from cursor) ── */
  const tiltX = isActive ? -mousePos.y * 7 : 0;
  const tiltY = isActive ? mousePos.x  * 7 : 0;

  const tier = TIER_CONFIG[ach.tier];

  return (
    <group ref={groupRef}>
      {/* Tier-colored ambient light — casts onto floor plane */}
      <pointLight
        color={ach.accent}
        intensity={isActive ? tier.lightIntensity : 0.35}
        distance={isActive ? 12 : 5}
        decay={2}
      />

      <Html center style={{ pointerEvents: isActive ? "auto" : "none" }}>
        <motion.div
          animate={{
            filter:  state.blur > 0 ? `blur(${state.blur}px)` : "none",
            opacity: state.opacity,
          }}
          transition={{ duration: 0.42 }}
          onClick={!isActive ? onSelect : undefined}
          style={{
            width:          "350px",
            background:     "rgba(4,4,14,0.88)",
            border:         `1px solid rgba(${ach.accentRgb},${isActive ? 0.52 : 0.2})`,
            borderRadius:   "16px",
            padding:        "28px 28px 26px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            transform:      `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition:     "transform 0.1s ease",
            boxShadow:      isActive
              ? `0 0 60px rgba(${ach.accentRgb},0.28), 0 30px 80px rgba(0,0,0,0.9), inset 0 0 60px rgba(${ach.accentRgb},0.04)`
              : `0 0 20px rgba(${ach.accentRgb},0.08)`,
            cursor:         isActive ? "default" : "pointer",
            position:       "relative",
            overflow:       "hidden",
          }}
        >
          {/* ── Corner brackets ── */}
          {(["top-left","top-right","bottom-left","bottom-right"] as const).map((corner) => (
            <div
              key={corner}
              style={{
                position:    "absolute",
                width:       14,
                height:      14,
                top:         corner.startsWith("top")    ? 8 : undefined,
                bottom:      corner.startsWith("bottom") ? 8 : undefined,
                left:        corner.endsWith("left")     ? 8 : undefined,
                right:       corner.endsWith("right")    ? 8 : undefined,
                borderTop:    corner.startsWith("top")    ? `2px solid rgba(${ach.accentRgb},0.55)` : undefined,
                borderBottom: corner.startsWith("bottom") ? `2px solid rgba(${ach.accentRgb},0.55)` : undefined,
                borderLeft:   corner.endsWith("left")     ? `2px solid rgba(${ach.accentRgb},0.55)` : undefined,
                borderRight:  corner.endsWith("right")    ? `2px solid rgba(${ach.accentRgb},0.55)` : undefined,
              }}
            />
          ))}

          {/* ── Scanline glitch beam ── */}
          {glitching && (
            <motion.div
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 0.35, ease: "linear" }}
              style={{
                position:  "absolute",
                left:      0,
                right:     0,
                height:    2,
                background:`rgba(${ach.accentRgb},0.95)`,
                zIndex:    10,
                boxShadow: `0 0 10px rgba(${ach.accentRgb},1)`,
              }}
            />
          )}

          {/* ── Glitch flash overlay ── */}
          {glitching && (
            <motion.div
              animate={{
                opacity: [0, 0.28, 0, 0.18, 0, 0.1, 0],
                x:       [0, -6, 5, -3, 0, 2, 0],
              }}
              transition={{
                duration: 0.44,
                times:    [0, 0.1, 0.25, 0.38, 0.55, 0.75, 1],
              }}
              style={{
                position:     "absolute",
                inset:        0,
                background:   ach.accent,
                zIndex:       9,
                pointerEvents:"none",
                borderRadius: "inherit",
              }}
            />
          )}

          {/* ── Top row: tier badge + year ── */}
          <div
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "flex-start",
              marginBottom:   20,
            }}
          >
            <span
              style={{
                fontFamily:    "JetBrains Mono, monospace",
                fontSize:      "8px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         ach.accent,
                background:    `rgba(${ach.accentRgb},0.1)`,
                border:        `1px solid rgba(${ach.accentRgb},0.32)`,
                padding:       "3px 9px",
                borderRadius:  3,
                boxShadow:     `0 0 10px rgba(${ach.accentRgb},0.2)`,
              }}
            >
              {tier.prefix} {tier.label} · CLR_{tier.clearance}
            </span>
            <span
              style={{
                fontFamily:    "JetBrains Mono, monospace",
                fontSize:      "8px",
                color:         "rgba(255,255,255,0.2)",
                letterSpacing: "0.2em",
              }}
            >
              {ach.year}
            </span>
          </div>

          {/* ── Icon + Animated metric ── */}
          <div
            style={{
              display:     "flex",
              alignItems:  "flex-end",
              gap:         14,
              marginBottom:8,
            }}
          >
            <span
              style={{
                fontSize: "2.2rem",
                filter:   `drop-shadow(0 0 16px ${ach.accent}80)`,
              }}
            >
              {ach.icon}
            </span>
            <AnimatedStat
              value={ach.metric}
              accent={ach.accent}
              accentRgb={ach.accentRgb}
              run={counting || (isActive && !glitching)}
            />
          </div>

          {/* ── Metric label ── */}
          <div
            style={{
              fontFamily:    "JetBrains Mono, monospace",
              fontSize:      "10px",
              color:         ach.accent,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity:       0.85,
              marginBottom:  4,
            }}
          >
            {ach.metricLabel}
          </div>
          {ach.metricSub && (
            <div
              style={{
                fontFamily:    "JetBrains Mono, monospace",
                fontSize:      "8px",
                color:         "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                marginBottom:  18,
              }}
            >
              {ach.metricSub}
            </div>
          )}

          {/* ── Divider ── */}
          <div
            style={{
              height:       1,
              background:   `linear-gradient(to right, rgba(${ach.accentRgb},0.6), rgba(${ach.accentRgb},0.05), transparent)`,
              marginBottom: 14,
            }}
          />

          {/* ── Title + org ── */}
          <div
            style={{
              fontFamily:    "'Space Grotesk', sans-serif",
              fontWeight:    700,
              fontSize:      "14px",
              color:         "#fff",
              marginBottom:  6,
              lineHeight:    1.3,
            }}
          >
            {ach.title}
          </div>
          <div
            style={{
              fontFamily:    "JetBrains Mono, monospace",
              fontSize:      "9px",
              color:         ach.accent,
              opacity:       0.7,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom:  12,
            }}
          >
            @ {ach.org}
          </div>

          {/* ── Description ── */}
          <div
            style={{
              fontFamily:  "'Inter', sans-serif",
              fontSize:    "11.5px",
              color:       "rgba(255,255,255,0.42)",
              lineHeight:  1.65,
            }}
          >
            {ach.description}
          </div>

          {/* ── Bottom accent bar ── */}
          <div
            style={{
              marginTop:  18,
              height:     1,
              background: `linear-gradient(to right, transparent, rgba(${ach.accentRgb},0.4), transparent)`,
            }}
          />
        </motion.div>
      </Html>
    </group>
  );
}

/* ─── Three.js Carousel Scene ─────────────────────────────────────────────── */
function CarouselScene({
  activeIdx,
  mousePos,
  onSelect,
}: {
  activeIdx: number;
  mousePos:  { x: number; y: number };
  onSelect:  (i: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.04} />
      <fog attach="fog" args={["#000008", 8, 22]} />

      {/* Reflective floor plane */}
      <mesh
        position={[0, -2.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[40, 40, 1]}
      >
        <planeGeometry />
        <meshStandardMaterial color="#000" metalness={0.9} roughness={0.6} />
      </mesh>

      {/* Scene-wide ambient glow from active tier */}
      <pointLight
        color={ACHIEVEMENTS[activeIdx].accent}
        intensity={0.5}
        distance={18}
        position={[0, 2, 0]}
      />

      {ACHIEVEMENTS.map((ach, i) => (
        <Card3D
          key={ach.id}
          ach={ach}
          cardIdx={i}
          activeIdx={activeIdx}
          mousePos={mousePos}
          onSelect={() => onSelect(i)}
        />
      ))}
    </>
  );
}

/* ─── Mobile Achievements Fallback ────────────────────────────────────────── */
function MobileAchievements() {
  return (
    <div className="w-full py-6 px-4 flex flex-col gap-4">
      {ACHIEVEMENTS.map((ach) => {
        const tier = TIER_CONFIG[ach.tier];
        return (
          <div
            key={ach.id}
            className="rounded-xl p-5"
            style={{
              background: "rgba(4,4,14,0.8)",
              border:     `1px solid rgba(${ach.accentRgb},0.3)`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                style={{
                  fontFamily:    "monospace",
                  fontSize:      "8px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color:         ach.accent,
                  background:    `rgba(${ach.accentRgb},0.1)`,
                  border:        `1px solid rgba(${ach.accentRgb},0.3)`,
                  padding:       "2px 7px",
                  borderRadius:  3,
                }}
              >
                {tier.prefix} {tier.label}
              </span>
              <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(255,255,255,0.2)" }}>
                {ach.year}
              </span>
            </div>
            <div className="flex items-end gap-3 mb-2">
              <span style={{ fontSize: "1.8rem" }}>{ach.icon}</span>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: "2rem", color: ach.accent, textShadow: `0 0 20px rgba(${ach.accentRgb},0.8)` }}>
                {ach.metric}
              </span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: ach.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>
              {ach.metricLabel}
            </div>
            {ach.metricSub && (
              <div style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>
                {ach.metricSub}
              </div>
            )}
            <div style={{ height: 1, background: `linear-gradient(to right,rgba(${ach.accentRgb},0.5),transparent)`, marginBottom: 10 }} />
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "13px", color: "#fff", marginBottom: 4 }}>
              {ach.title}
            </h3>
            <p style={{ fontFamily: "monospace", fontSize: "8px", color: ach.accent, opacity: 0.65, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
              @ {ach.org}
            </p>
            <p style={{ fontFamily: "sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
              {ach.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Nav Arrow Button ────────────────────────────────────────────────────── */
function NavBtn({
  onClick,
  disabled,
  children,
}: {
  onClick:  () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 rounded-lg border flex items-center justify-center font-mono text-sm transition-all duration-200"
      style={{
        borderColor: disabled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.25)",
        color:       disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
        background:  "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Main Section ────────────────────────────────────────────────────────── */
export default function AchievementsSection() {
  const isMobile  = useIsMobile();
  const [activeIdx, setActiveIdx] = useState(0);
  const [mousePos,  setMousePos]  = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);
  const lastWheelTime = useRef<number>(0);

  const prev = useCallback(() => setActiveIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setActiveIdx((i) => Math.min(ACHIEVEMENTS.length - 1, i + 1)),
    [],
  );

  /* Captured wheel event: moves achievements in place without scrolling the screen */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 5) return;
      const now = Date.now();
      const delta = e.deltaY;

      if (delta > 0) {
        if (activeIdx < ACHIEVEMENTS.length - 1) {
          e.preventDefault();
          if (now - lastWheelTime.current > 280) {
            setActiveIdx((i) => Math.min(ACHIEVEMENTS.length - 1, i + 1));
            lastWheelTime.current = now;
          }
        }
      } else if (delta < 0) {
        if (activeIdx > 0) {
          e.preventDefault();
          if (now - lastWheelTime.current > 280) {
            setActiveIdx((i) => Math.max(0, i - 1));
            lastWheelTime.current = now;
          }
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [activeIdx, isMobile]);

  /* Keyboard navigation */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next]);

  /* Mouse tracking for reverse parallax */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x:  (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2),
      y:  (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2),
    });
  }, []);

  const active = ACHIEVEMENTS[activeIdx];
  const tier   = TIER_CONFIG[active.tier];

  /* Stats for the console bar */
  const consoleStat = [
    { label: "TOTAL_RECORDS", value: ACHIEVEMENTS.length.toString(), color: "#00E5FF" },
    { label: "GLOBAL_RANK",   value: "#542",   color: "#FFD700" },
    { label: "NATIONAL_RANK", value: "#149",   color: "#A18AFF" },
    { label: "GATE_AIR",      value: "9602",   color: "#FFD700" },
    { label: "RANK_1_COUNT",  value: "2×",     color: "#39FF14" },
  ];

  if (isMobile) {
    return (
      <section
        className="relative w-full py-16 px-4"
        style={{ background: "#000008" }}
      >
        {/* Header */}
        <div className="relative z-20 mb-6 pointer-events-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FFD700]" />
            <span
              className="font-mono text-[9px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(255,215,0,0.65)" }}
            >
              HALL_OF_FAME · CLASSIFIED_RECORDS · {new Date().getFullYear()}
            </span>
          </div>
          <h1 className="font-display font-black uppercase leading-none tracking-tight mb-4 text-3xl">
            <span className="text-white">Achievements</span>{" "}
            <span
              className="animate-glitch"
              style={{
                background: "linear-gradient(135deg,#FFD700 0%,#00E5FF 50%,#A18AFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              &amp; Records
            </span>
          </h1>
        </div>
        <MobileAchievements />
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[720px] overflow-hidden flex flex-col justify-between"
      style={{ background: "#000008" }}
      onMouseMove={handleMouseMove}
    >
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 z-30 bg-white/5">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${((activeIdx + 1) / ACHIEVEMENTS.length) * 100}%`,
            background: `linear-gradient(to right, ${active.accent}, #00E5FF)`,
            boxShadow: `0 0 12px ${active.accent}`,
          }}
        />
      </div>

      {/* ── Header ── */}
      <div className="relative z-20 px-6 sm:px-10 lg:px-20 pt-20 sm:pt-24 pb-2 pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FFD700]" />
          <span
            className="font-mono text-[9px] tracking-[0.35em] uppercase"
            style={{ color: "rgba(255,215,0,0.65)" }}
          >
            HALL_OF_FAME · CLASSIFIED_RECORDS · {new Date().getFullYear()}
          </span>
        </div>

        <h1 className="font-display font-black uppercase leading-none tracking-tight mb-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
          <span className="text-white">Achievements</span>{" "}
          <span
            className="animate-glitch"
            style={{
              background:           "linear-gradient(135deg,#FFD700 0%,#00E5FF 50%,#A18AFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
            }}
          >
            &amp; Records
          </span>
        </h1>

        {/* Stats console bar */}
        <div
          className="rounded-xl overflow-hidden mb-4"
          style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,4,12,0.7)" }}
        >
          {/* Console header */}
          <div className="flex items-center gap-3 px-5 py-2 border-b border-white/[0.04]">
            <div className="flex gap-1.5">
              {["#FF4D4D", "#FFD700", "#39FF14"].map((c) => (
                <div key={c} className="w-[7px] h-[7px] rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-white/18 flex-1">
              ACHIEVEMENT_LOG.SYS — VERIFIED RECORDS
            </span>
            <span className="font-mono text-[7px] text-white/12">PID:4821</span>
          </div>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-white/[0.05]">
            {consoleStat.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="p-3 sm:p-4 text-center group cursor-default hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="font-display font-black text-xl sm:text-2xl mb-1 tabular-nums"
                  style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}
                >
                  {s.value}
                </div>
                <div className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/22">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active card label */}
        <div className="flex items-center gap-3">
          <div
            className="w-[6px] h-[6px] rounded-full animate-ping"
            style={{ background: active.accent, opacity: 0.7 }}
          />
          <span
            className="font-mono text-[8px] tracking-[0.25em] uppercase"
            style={{ color: `rgba(${active.accentRgb},0.7)` }}
          >
            {tier.prefix} {tier.label} · {active.categoryTag} · {active.year}
          </span>
        </div>
      </div>

      {/* ── 3D Canvas Scene ── */}
      <div className="relative flex-1 w-full min-h-[360px]">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        >
          <CarouselScene
            activeIdx={activeIdx}
            mousePos={mousePos}
            onSelect={setActiveIdx}
          />
        </Canvas>
      </div>

      {/* ── Navigation controls & Scroll Cue ── */}
      <div className="relative z-20 px-6 sm:px-12 py-5 flex items-center justify-between pointer-events-auto border-t border-white/[0.04]" style={{ background: "rgba(4,4,12,0.85)", backdropFilter: "blur(12px)" }}>
        {/* Record Index */}
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-white/40">
          <span style={{ color: active.accent }}>REC {String(activeIdx + 1).padStart(2, "0")}</span>
          <span className="text-white/20">/</span>
          <span>{String(ACHIEVEMENTS.length).padStart(2, "0")}</span>
        </div>

        {/* Center Navigation Buttons & Dots */}
        <div className="flex items-center gap-5">
          <NavBtn onClick={prev} disabled={activeIdx === 0}>◀</NavBtn>

          <div className="flex gap-2 items-center">
            {ACHIEVEMENTS.map((ach, i) => (
              <button
                key={ach.id}
                onClick={() => setActiveIdx(i)}
                className="transition-all duration-300"
                style={{
                  width:        i === activeIdx ? 22 : 6,
                  height:       6,
                  borderRadius: 3,
                  background:   i === activeIdx
                    ? ach.accent
                    : "rgba(255,255,255,0.18)",
                  boxShadow:    i === activeIdx
                    ? `0 0 10px ${ach.accent}`
                    : "none",
                }}
              />
            ))}
          </div>

          <NavBtn onClick={next} disabled={activeIdx === ACHIEVEMENTS.length - 1}>▶</NavBtn>
        </div>

        {/* Scroll Cue Animation */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-white/30">
          <span>SCROLL TO MOVE CARDS</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ color: active.accent }}
          >
            ↕
          </motion.span>
        </div>
      </div>
    </section>
  );
}
