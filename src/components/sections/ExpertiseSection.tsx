"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

// ─── Skill Category Data ────────────────────────────────────────────────────
const skillCategories = [
  {
    id: "lang",
    reg: "SYS_01",
    label: "Programming Languages",
    tag: "LANG",
    accent: "#00E5FF",
    accentRgb: "0,229,255",
    icon: "⟨/⟩",
    items: ["C", "C++", "Python", "Java", "JavaScript", "TypeScript", "R", "Golang"],
  },
  {
    id: "core",
    reg: "SYS_02",
    label: "Core Concepts",
    tag: "CORE",
    accent: "#A18AFF",
    accentRgb: "161,138,255",
    icon: "◈",
    items: [
      "Software Engineering",
      "DSA",
      "OOP",
      "DBMS",
      "Code Interpretation",
      "Network Engineering",
      "Mathematics",
    ],
  },
  {
    id: "frontend",
    reg: "SYS_03",
    label: "Frontend",
    tag: "FE",
    accent: "#39FF14",
    accentRgb: "57,255,20",
    icon: "⬡",
    items: ["HTML5", "CSS3", "TailwindCSS", "React.js", "React Native", "AngularJS", "Next.js"],
  },
  {
    id: "backend",
    reg: "SYS_04",
    label: "Backend & APIs",
    tag: "BE",
    accent: "#FFD700",
    accentRgb: "255,215,0",
    icon: "⚙",
    items: ["Flask", "Node.js", "Express.js", "FastAPI", "Streamlit"],
  },
  {
    id: "ai",
    reg: "SYS_05",
    label: "AI & Data Science",
    tag: "AI",
    accent: "#FF6BFF",
    accentRgb: "255,107,255",
    icon: "◎",
    items: [
      "NumPy",
      "Pandas",
      "TensorFlow",
      "OpenCV",
      "Hugging Face",
      "LangChain",
      "LangGraph",
      "GNN",
      "CNN",
      "RNN",
      "Google API",
      "OpenAI API",
    ],
  },
  {
    id: "cyber",
    reg: "SYS_06",
    label: "Cybersecurity",
    tag: "SEC",
    accent: "#FF4444",
    accentRgb: "255,68,68",
    icon: "⚠",
    items: ["Kali Linux", "Metasploit", "ZenMap", "Nmap", "Wireshark"],
  },
  {
    id: "db",
    reg: "SYS_07",
    label: "Databases",
    tag: "DB",
    accent: "#00FFB3",
    accentRgb: "0,255,179",
    icon: "▣",
    items: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    id: "tools",
    reg: "SYS_08",
    label: "Tools & Platforms",
    tag: "TOOLS",
    accent: "#FFA500",
    accentRgb: "255,165,0",
    icon: "⊞",
    items: [
      "OpenRouter",
      "Antigravity",
      "VS Code",
      "Git",
      "GitHub",
      "Google AI Studio",
      "Google Cloud",
      "MongoDB Cloud",
      "n8n",
      "Zapier",
      "Linux",
      "GNU Make",
      "Power BI",
    ],
  },
  {
    id: "soft",
    reg: "SYS_09",
    label: "Professional & Cognitive",
    tag: "SOFT",
    accent: "#94A3B8",
    accentRgb: "148,163,184",
    icon: "◉",
    items: [
      "Problem Solving",
      "Logical Reasoning",
      "Analytical Skills",
      "Critical Thinking",
      "Communication",
      "Presentations",
      "Time Management",
      "Student Leadership",
      "English",
    ],
  },
];

// ─── Individual Skill Badge ─────────────────────────────────────────────────
function SkillBadge({ name, accent, accentRgb }: { name: string; accent: string; accentRgb: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={
        hovered
          ? {
              scale: 1.08,
              borderColor: accent,
              boxShadow: `0 0 14px rgba(${accentRgb},0.5), inset 0 0 10px rgba(${accentRgb},0.08)`,
              color: accent,
            }
          : {
              scale: 1,
              borderColor: "rgba(255,255,255,0.1)",
              boxShadow: "none",
              color: "rgba(209,209,209,0.8)",
            }
      }
      transition={{ duration: 0.2 }}
      className="inline-flex items-center px-3 py-1.5 rounded-md border font-mono text-[11px] tracking-wider cursor-default select-none"
      style={{ willChange: "transform, box-shadow" }}
    >
      {name}
    </motion.span>
  );
}

// ─── Category Card ───────────────────────────────────────────────────────────
function CategoryCard({
  category,
  index,
  isExpanded,
  onToggle,
}: {
  category: (typeof skillCategories)[number];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-xl overflow-hidden glass-panel group cursor-pointer"
      onClick={onToggle}
      style={{
        border: `1px solid ${isHovered ? `rgba(${category.accentRgb},0.35)` : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Radial mouse-follow glow */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-xl"
          style={{
            inset: 0,
            background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${category.accentRgb},0.08), transparent 70%)`,
          }}
        />
      )}

      {/* Top scan line on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px]"
        animate={
          isHovered
            ? { opacity: 1, scaleX: 1, boxShadow: `0 0 12px rgba(${category.accentRgb},1)` }
            : { opacity: 0.2, scaleX: 0.6, boxShadow: "none" }
        }
        style={{ backgroundColor: category.accent, transformOrigin: "left" }}
        transition={{ duration: 0.4 }}
      />

      {/* Card Header */}
      <div className="p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Icon + Tag */}
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 font-mono text-lg"
            style={{
              background: `rgba(${category.accentRgb},0.12)`,
              border: `1px solid rgba(${category.accentRgb},0.3)`,
              color: category.accent,
              textShadow: `0 0 10px rgba(${category.accentRgb},0.8)`,
            }}
          >
            {category.icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded"
                style={{
                  color: category.accent,
                  background: `rgba(${category.accentRgb},0.1)`,
                  border: `1px solid rgba(${category.accentRgb},0.2)`,
                }}
              >
                {category.reg}
              </span>
              <span className="font-mono text-[9px] text-white/20 tracking-widest">//</span>
              <span className="font-mono text-[9px] text-white/20 tracking-widest uppercase">{category.tag}</span>
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white/90 truncate">
              {category.label}
            </h3>
          </div>
        </div>

        {/* Count + Toggle */}
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline font-mono text-xs text-white/30">
            {String(category.items.length).padStart(2, "0")} MODULES
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 135 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-7 h-7 rounded-full border flex items-center justify-center font-mono text-sm"
            style={{
              borderColor: isExpanded ? category.accent : "rgba(255,255,255,0.15)",
              color: isExpanded ? category.accent : "rgba(255,255,255,0.4)",
              boxShadow: isExpanded ? `0 0 10px rgba(${category.accentRgb},0.4)` : "none",
            }}
          >
            +
          </motion.div>
        </div>
      </div>

      {/* Expandable Skill Badges */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Separator */}
            <div
              className="mx-5 h-[1px]"
              style={{ background: `linear-gradient(to right, rgba(${category.accentRgb},0.4), transparent)` }}
            />
            <div className="p-5 sm:p-6 pt-4 flex flex-wrap gap-2">
              {category.items.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <SkillBadge name={item} accent={category.accent} accentRgb={category.accentRgb} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Animated Ticker ─────────────────────────────────────────────────────────
const tickerItems = [
  "C/C++", "PYTHON", "TENSORFLOW", "REACT.JS", "NODE.JS",
  "NEXT.JS", "LANGCHAIN", "LINUX", "POSTGRESQL", "CYBERSECURITY",
  "OPENAI_API", "HUGGING_FACE", "GOLANG", "TYPESCRIPT", "POWER_BI",
];

function SkillTicker() {
  return (
    <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="flex items-center gap-4 font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
            {item}
            <span className="w-1 h-1 rounded-full bg-teal/40" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ExpertiseSection() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["lang", "ai"]));
  const [allExpanded, setAllExpanded] = useState(false);

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
      setAllExpanded(false);
    } else {
      setExpandedIds(new Set(skillCategories.map((c) => c.id)));
      setAllExpanded(true);
    }
  };

  // Sync allExpanded with expandedIds
  const allCurrentlyExpanded = expandedIds.size === skillCategories.length;

  return (
    <section className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-24 flex flex-col justify-center">

      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* HUD Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 sm:mb-16 z-10 relative"
      >
        <p className="font-mono text-teal text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4 opacity-80">
          ── SKILL_MATRIX // REGISTRY ──
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              SKILL{" "}
              <span className="text-teal italic opacity-90" style={{ textShadow: "0 0 30px rgba(0,229,255,0.5)" }}>
                // MATRIX
              </span>
            </h2>
            <p className="font-sans text-white/40 text-sm mt-3 max-w-xl leading-relaxed">
              A full registry of technical capabilities, tools, and cognitive frameworks — click any module to expand the skill tree.
            </p>
          </div>

          {/* Stats + Toggle All */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="font-mono text-2xl font-bold text-white">
                {skillCategories.reduce((acc, c) => acc + c.items.length, 0)}
              </div>
              <div className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Total Skills</div>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-right">
              <div className="font-mono text-2xl font-bold" style={{ color: "#00E5FF" }}>
                {skillCategories.length}
              </div>
              <div className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Domains</div>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <button
              onClick={toggleAll}
              className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-lg border transition-all duration-300"
              style={{
                borderColor: allCurrentlyExpanded ? "rgba(0,229,255,0.5)" : "rgba(255,255,255,0.15)",
                color: allCurrentlyExpanded ? "#00E5FF" : "rgba(255,255,255,0.4)",
                background: allCurrentlyExpanded ? "rgba(0,229,255,0.08)" : "transparent",
              }}
            >
              {allCurrentlyExpanded ? "COLLAPSE ALL" : "EXPAND ALL"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Skill Category Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 z-10 relative">
        {skillCategories.map((category, idx) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={idx}
            isExpanded={expandedIds.has(category.id)}
            onToggle={() => toggle(category.id)}
          />
        ))}
      </div>

      {/* Ticker */}
      <div className="mt-20 border-t border-white/[0.06] pt-6 overflow-hidden z-10 relative">
        <SkillTicker />
      </div>

      {/* Experience CTA */}
      <div className="mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-xl p-7 sm:p-8 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-teal/20 transition-colors duration-500"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">
              [ LOG_TYPE: DEPLOYMENT_HISTORY ]
            </p>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
              SERVICE <span className="text-teal italic opacity-80">// LOGS</span>
            </h3>
            <p className="font-sans text-xs text-white/40 mt-2 max-w-md leading-relaxed">
              A full chronological record of deployments, internships, and active organizational roles — rendered as a cybernetic timeline.
            </p>
          </div>
          <a
            href="/experience"
            className="shrink-0 font-mono text-xs tracking-widest uppercase px-8 py-3 rounded-full border border-teal/40 text-teal hover:bg-teal/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all duration-300 flex items-center gap-3"
          >
            ACCESS TIMELINE <span className="text-lg">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
