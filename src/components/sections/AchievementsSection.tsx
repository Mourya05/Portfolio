"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tier = "legendary" | "epic" | "rare";

interface Achievement {
  id: string;
  tier: Tier;
  category: string;
  categoryTag: string;
  title: string;
  org: string;
  metric: string;         // Big bold number/rank text
  metricLabel: string;    // E.g. "All India Rank"
  metricSub?: string;     // Sub-label e.g. "out of 170,000+"
  description: string;
  accent: string;
  accentRgb: string;
  icon: string;
  year: string;
}

// ─── Achievement Data ─────────────────────────────────────────────────────────
const ACHIEVEMENTS: Achievement[] = [
  // ── LEGENDARY ──────────────────────────────────────────────────────────────
  {
    id: "A_001",
    tier: "legendary",
    category: "National Competitive Exam",
    categoryTag: "GATE_CSE",
    title: "GATE 2026 — Computer Science",
    org: "IIT · GATE",
    metric: "9602",
    metricLabel: "All India Rank",
    metricSub: "AIR among 170,000+ candidates",
    description:
      "Secured All India Rank 9602 in GATE 2026 CSE — one of India's most competitive postgraduate engineering entrance examinations, testing advanced algorithms, systems, and mathematical foundations.",
    accent: "#FFD700",
    accentRgb: "255,215,0",
    icon: "🏛️",
    year: "2026",
  },
  {
    id: "A_002",
    tier: "legendary",
    category: "International Competition",
    categoryTag: "IEEE_XTREME",
    title: "IEEE Xtreme 18.0",
    org: "IEEE · Global",
    metric: "#542",
    metricLabel: "Global Rank",
    metricSub: "#149 National · 5000+ teams worldwide",
    description:
      "Competed in IEEE Xtreme 18.0, a 24-hour global programming marathon hosted by IEEE with thousands of teams worldwide. Ranked 542nd globally and 149th nationally — placing in the top 10% of all international participants.",
    accent: "#00E5FF",
    accentRgb: "0,229,255",
    icon: "🌐",
    year: "2024",
  },

  // ── EPIC ───────────────────────────────────────────────────────────────────
  {
    id: "A_003",
    tier: "epic",
    category: "National Hackathon",
    categoryTag: "HACKATHON",
    title: "CTF Hackathon",
    org: "Supraja Technologies",
    metric: "🏆",
    metricLabel: "Best Student Award",
    metricSub: "Capture The Flag · Cybersecurity",
    description:
      "Awarded 'Best Student' at the CTF Hackathon organized by Supraja Technologies — a cybersecurity-focused challenge testing penetration testing, vulnerability exploitation, and forensic analysis skills.",
    accent: "#FF4D4D",
    accentRgb: "255,77,77",
    icon: "🔐",
    year: "2025",
  },
  {
    id: "A_004",
    tier: "epic",
    category: "National Level",
    categoryTag: "MATH_COMP",
    title: "Ramanujan Mathematical Competition",
    org: "National · Srinivasa Ramanujan",
    metric: "TOP",
    metricLabel: "National Finalist",
    metricSub: "Srinivasa Ramanujan Mathematical Competition",
    description:
      "Advanced to the National Finalist stage of the prestigious Srinivasa Ramanujan Mathematical Competition — a proof-based competition honouring India's greatest mathematical mind, testing number theory, combinatorics, and advanced problem-solving.",
    accent: "#A18AFF",
    accentRgb: "161,138,255",
    icon: "∑",
    year: "2024",
  },
  {
    id: "A_005",
    tier: "epic",
    category: "Agentic AI Hackathon",
    categoryTag: "AGENTATION",
    title: "Agentation 2025",
    org: "Malla Reddy University",
    metric: "FINL",
    metricLabel: "Finalist",
    metricSub: "Biggest Agentic AI Hackathon · India",
    description:
      "Selected as a Finalist in Agentation 2025 — the largest Agentic AI hackathon in India, hosted at Malla Reddy University. Built and demonstrated an autonomous AI agent system, competing against teams from across the country.",
    accent: "#39FF14",
    accentRgb: "57,255,20",
    icon: "🤖",
    year: "2025",
  },

  // ── RARE (College-Wide) ────────────────────────────────────────────────────
  {
    id: "A_006",
    tier: "rare",
    category: "Coding Challenge",
    categoryTag: "SMART_INT",
    title: "GCET-2027-R Coding Challenge",
    org: "Smart Interviews · GCET",
    metric: "#1",
    metricLabel: "Rank 1",
    metricSub: "College-wide · Competitive Programming",
    description:
      "Secured Rank 1 in the Smart Interviews GCET-2027-R Coding Challenge among all peers college-wide — a competitive programming contest evaluating algorithmic problem-solving, data structures, and code efficiency.",
    accent: "#00E5FF",
    accentRgb: "0,229,255",
    icon: "💻",
    year: "2024",
  },
  {
    id: "A_007",
    tier: "rare",
    category: "Mathematics",
    categoryTag: "MATHS",
    title: "Tricky Maths Competition",
    org: "GCET · Internal",
    metric: "#1",
    metricLabel: "Rank 1",
    metricSub: "College-wide · Mathematical Reasoning",
    description:
      "Secured Rank 1 in the Tricky Maths intra-college competition — testing rapid mathematical reasoning, mental arithmetic, and pattern recognition under timed conditions.",
    accent: "#A18AFF",
    accentRgb: "161,138,255",
    icon: "🧮",
    year: "2024",
  },
  {
    id: "A_008",
    tier: "rare",
    category: "Technical Event",
    categoryTag: "ALPHAMATICA",
    title: "Alphamatica 2024",
    org: "GCET · Technical Fest",
    metric: "#2",
    metricLabel: "Second Position",
    metricSub: "Technical Symposium · GCET",
    description:
      "Secured Second Position in Alphamatica 2024 — a technical symposium event at GCET, competing across algorithmic challenges and technical quizzes.",
    accent: "#FFA500",
    accentRgb: "255,165,0",
    icon: "⚡",
    year: "2024",
  },
];

// ─── Tier Config ──────────────────────────────────────────────────────────────
const TIER_CONFIG: Record<
  Tier,
  { label: string; glow: string; badge: string; badgeRgb: string; prefix: string }
> = {
  legendary: {
    label: "LEGENDARY",
    glow: "rgba(255,215,0,0.18)",
    badge: "#FFD700",
    badgeRgb: "255,215,0",
    prefix: "◆",
  },
  epic: {
    label: "EPIC",
    glow: "rgba(161,138,255,0.14)",
    badge: "#A18AFF",
    badgeRgb: "161,138,255",
    prefix: "◈",
  },
  rare: {
    label: "RARE",
    glow: "rgba(0,229,255,0.1)",
    badge: "#00E5FF",
    badgeRgb: "0,229,255",
    prefix: "◇",
  },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedMetric({
  value,
  accent,
  accentRgb,
  hovered,
}: {
  value: string;
  accent: string;
  accentRgb: string;
  hovered: boolean;
}) {
  // If numeric, count up; otherwise just display
  const isNumeric = /^\d+$/.test(value);
  const numVal = isNumeric ? parseInt(value, 10) : null;

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState(isNumeric ? "0" : value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isNumeric || !inView) return;
    motionVal.set(numVal!);
  }, [inView, isNumeric, motionVal, numVal]);

  useEffect(() => {
    if (!isNumeric) return;
    const unsub = spring.on("change", (v) =>
      setDisplay(Math.round(v).toLocaleString())
    );
    return unsub;
  }, [spring, isNumeric]);

  return (
    <span
      ref={ref}
      className="font-display font-black leading-none tabular-nums transition-all duration-500"
      style={{
        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
        color: accent,
        textShadow: hovered
          ? `0 0 40px rgba(${accentRgb},0.9), 0 0 80px rgba(${accentRgb},0.4)`
          : `0 0 20px rgba(${accentRgb},0.5)`,
        letterSpacing: "-0.03em",
      }}
    >
      {display}
    </span>
  );
}

// ─── Light-Sweep Effect ───────────────────────────────────────────────────────
function LightSweep({ accent, active }: { accent: string; active: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
      initial={false}
    >
      <motion.div
        className="absolute top-0 bottom-0 w-[60%]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${accent.replace(/[^0-9,]/g, "")},0.06) 50%, transparent)`,
          filter: "blur(12px)",
        }}
        initial={{ x: "-80%" }}
        animate={active ? { x: ["−80%", "160%"] } : { x: "-80%" }}
        transition={
          active
            ? { duration: 0.9, ease: "easeInOut", repeat: 0 }
            : { duration: 0 }
        }
      />
    </motion.div>
  );
}

// ─── Achievement Card ─────────────────────────────────────────────────────────
function AchievementCard({
  ach,
  index,
}: {
  ach: Achievement;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [swept, setSwept] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const tier = TIER_CONFIG[ach.tier];

  const handleEnter = () => {
    setHovered(true);
    setSwept(true);
    setTimeout(() => setSwept(false), 1000);
  };

  // Legendary cards are full-width; epic are half; rare are auto
  const isLegendary = ach.tier === "legendary";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl overflow-hidden cursor-default group ${
        isLegendary ? "lg:col-span-2" : ""
      }`}
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(${ach.accentRgb},0.07) 0%, rgba(4,4,10,0.9) 60%)`
          : "rgba(4,4,10,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hovered ? ach.accent + "55" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered
          ? `0 0 0 1px ${ach.accent}22, 0 20px 60px rgba(0,0,0,0.7), 0 0 60px ${ach.accent}15`
          : "0 8px 40px rgba(0,0,0,0.5)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Light sweep */}
      <LightSweep accent={ach.accent} active={swept} />

      {/* Top border beam */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${ach.accent} 40%, ${tier.badge} 60%, transparent 100%)`,
          opacity: hovered ? 1 : 0.3,
          filter: hovered ? `blur(0px) drop-shadow(0 0 6px ${ach.accent})` : "none",
        }}
      />

      {/* Tier corner badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span
          className="font-mono text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded"
          style={{
            color: tier.badge,
            background: `rgba(${tier.badgeRgb},0.12)`,
            border: `1px solid rgba(${tier.badgeRgb},0.3)`,
            boxShadow: hovered ? `0 0 10px rgba(${tier.badgeRgb},0.4)` : "none",
            transition: "all 0.3s ease",
          }}
        >
          {tier.prefix} {tier.label}
        </span>
      </div>

      {/* Card body */}
      <div className={`p-6 sm:p-8 ${isLegendary ? "lg:p-10" : ""}`}>
        <div
          className={`flex gap-6 sm:gap-8 ${
            isLegendary ? "flex-col sm:flex-row items-start sm:items-center" : "flex-col"
          }`}
        >
          {/* Left — metric display */}
          <div
            className={`shrink-0 flex flex-col gap-1 ${
              isLegendary ? "sm:min-w-[220px]" : "min-w-0"
            }`}
          >
            {/* Category label */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="font-mono text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded"
                style={{
                  color: ach.accent,
                  background: `rgba(${ach.accentRgb},0.1)`,
                  border: `1px solid rgba(${ach.accentRgb},0.2)`,
                }}
              >
                {ach.categoryTag}
              </span>
              <span className="font-mono text-[8px] text-white/20 tracking-widest">
                {ach.id}
              </span>
            </div>

            {/* Icon + big metric */}
            <div className="flex items-end gap-4">
              <span
                className="text-3xl sm:text-4xl"
                style={{ filter: `drop-shadow(0 0 12px ${ach.accent}80)` }}
              >
                {ach.icon}
              </span>
              <AnimatedMetric
                value={ach.metric}
                accent={ach.accent}
                accentRgb={ach.accentRgb}
                hovered={hovered}
              />
            </div>

            {/* Metric label */}
            <div className="mt-1.5">
              <div
                className="font-mono text-[11px] tracking-widest uppercase font-semibold"
                style={{ color: ach.accent, opacity: 0.85 }}
              >
                {ach.metricLabel}
              </div>
              {ach.metricSub && (
                <div className="font-mono text-[9px] tracking-wider text-white/30 mt-0.5">
                  {ach.metricSub}
                </div>
              )}
            </div>

            {/* Divider line for legendary */}
            {isLegendary && (
              <div
                className="hidden sm:block mt-5 w-full h-[1px]"
                style={{
                  background: `linear-gradient(to right, ${ach.accent}50, transparent)`,
                }}
              />
            )}
            {!isLegendary && (
              <div
                className="mt-4 w-full h-[1px]"
                style={{
                  background: `linear-gradient(to right, ${ach.accent}40, transparent)`,
                }}
              />
            )}
          </div>

          {/* Right — text content */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <div className="mb-1 font-mono text-[9px] tracking-widest uppercase text-white/25">
              {ach.year} · {ach.category}
            </div>

            <h3
              className="font-display font-bold text-white leading-tight mb-1 transition-colors duration-300"
              style={{
                fontSize: isLegendary ? "clamp(1.1rem, 2.5vw, 1.5rem)" : "1.05rem",
                color: hovered ? "#ffffff" : "rgba(255,255,255,0.9)",
              }}
            >
              {ach.title}
            </h3>

            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-4 transition-colors duration-300"
              style={{ color: hovered ? ach.accent : `${ach.accent}70` }}
            >
              @ {ach.org}
            </p>

            <p className="font-sans text-[13px] text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300 max-w-lg">
              {ach.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom scan line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(to right, transparent, ${ach.accent}, transparent)`,
        }}
        animate={{ opacity: hovered ? 0.5 : 0, scaleX: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
      />

      {/* Ambient bottom glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${ach.accent}10 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </motion.div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { label: "Total Achievements", value: ACHIEVEMENTS.length.toString(), color: "#00E5FF" },
    { label: "Global Rank", value: "#542", color: "#FFD700" },
    { label: "National Rank", value: "#149", color: "#A18AFF" },
    { label: "GATE AIR", value: "9602", color: "#FFD700" },
    { label: "College Rank 1s", value: "2×", color: "#39FF14" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-14 sm:mb-20">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
          className="relative rounded-xl border border-white/6 p-4 sm:p-5 text-center overflow-hidden group hover:border-white/15 transition-colors duration-300"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="font-display font-black text-2xl sm:text-3xl mb-1 tabular-nums"
            style={{
              color: s.color,
              textShadow: `0 0 20px ${s.color}60`,
            }}
          >
            {s.value}
          </div>
          <div className="font-mono text-[9px] tracking-widest uppercase text-white/30">
            {s.label}
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-[1px]"
            style={{
              background: `linear-gradient(to right, transparent, ${s.color}40, transparent)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Tier Legend ──────────────────────────────────────────────────────────────
function TierLegend() {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-5 items-center">
      {(Object.entries(TIER_CONFIG) as [Tier, (typeof TIER_CONFIG)[Tier]][]).map(
        ([tier, cfg]) => (
          <div key={tier} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: cfg.badge,
                boxShadow: `0 0 8px rgba(${cfg.badgeRgb},0.8)`,
              }}
            />
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: `rgba(${cfg.badgeRgb},0.8)` }}
            >
              {cfg.prefix} {cfg.label}
            </span>
          </div>
        )
      )}
    </div>
  );
}

// ─── Scrolling Ticker ─────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "GATE · AIR 9602",
  "IEEE XTREME · RANK 542 GLOBAL",
  "IEEE · RANK 149 NATIONAL",
  "CTF HACKATHON · BEST STUDENT",
  "RAMANUJAN COMPETITION · NATIONAL FINALIST",
  "AGENTATION 2025 · FINALIST",
  "CODING CHALLENGE · RANK 1",
  "TRICKY MATHS · RANK 1",
  "ALPHAMATICA 2024 · 2ND POSITION",
];

function AchievementTicker() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 font-mono text-[9px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            {item}
            <span
              className="w-1 h-1 rounded-full inline-block"
              style={{ background: "rgba(0,229,255,0.4)" }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function AchievementsSection() {
  return (
    <section className="relative w-full min-h-screen py-20 sm:py-28 px-4 sm:px-6 lg:px-16 xl:px-24 flex flex-col">
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Top-left glow */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 65%)",
          }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12 sm:mb-16"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FFD700]" />
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(255,215,0,0.7)" }}>
              HALL_OF_FAME · LEADERBOARD
            </span>
          </div>

          <h1 className="font-display font-black uppercase leading-none tracking-tight mb-5 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-white">Achievements</span>{" "}
            <span
              className="animate-glitch"
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #00E5FF 50%, #A18AFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              &amp; Record
            </span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <p className="font-sans text-white/50 text-sm max-w-2xl leading-relaxed">
              A battle-tested log of national ranks, global placements, and competitive milestones —
              each entry a proof-of-work in the engineering arena.
            </p>
            <TierLegend />
          </div>
        </motion.div>

        {/* ── Stats Bar ── */}
        <StatsBar />

        {/* ── Achievement Cards Grid ── */}
        {/* Legendary + Epic grouped, Rare below */}
        <div className="space-y-6">
          {/* Legendary + Epic: 2-col grid where legendary spans full width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {ACHIEVEMENTS.filter((a) => a.tier === "legendary" || a.tier === "epic").map(
              (ach, i) => (
                <AchievementCard key={ach.id} ach={ach} index={i} />
              )
            )}
          </div>

          {/* Rare: 1–3 col grid */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0,229,255,0.3), transparent)",
                }}
              />
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/25">
                ◇ INSTITUTIONAL MILESTONES
              </span>
              <div
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(to left, rgba(0,229,255,0.3), transparent)",
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ACHIEVEMENTS.filter((a) => a.tier === "rare").map((ach, i) => (
                <AchievementCard key={ach.id} ach={ach} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer Ticker ── */}
        <div className="mt-20 border-t border-white/[0.05] pt-6 overflow-hidden">
          <AchievementTicker />
        </div>

        {/* ── Footer tag ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
          <span className="font-mono text-[9px] text-white/15 tracking-widest">
            -- ACHIEVEMENT_LOG · VERIFIED · {new Date().getFullYear()} --
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-white/5 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
