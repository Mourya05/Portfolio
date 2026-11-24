"use client";

import { motion } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface SkillGroup {
  label:   string;
  variant: "tag-systems" | "tag-ml" | "tag-infra";
  items:   string[];
}

interface AchievementItem {
  title:   string;
  context: string;
  isKey:   boolean;
}

interface CertItem {
  name:   string;
  issuer: string;
  signal: boolean;  // only show high-signal certs
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const skillGroups: SkillGroup[] = [
  {
    label:   "Systems & Languages",
    variant: "tag-systems",
    items:   ["C", "C++", "CUDA", "x86 Assembly (NASM)", "Python", "R", "Linux / POSIX", "BLE / GATT"],
  },
  {
    label:   "AI / ML & Data",
    variant: "tag-ml",
    items:   ["PyTorch", "PyTorch Geometric", "CUDA Kernels", "Bayesian Inference", "OpenCV", "LLM Inference", "SQL", "NumPy / Pandas"],
  },
  {
    label:   "Infrastructure & Tools",
    variant: "tag-infra",
    items:   ["React / React Native", "Node.js", "FastAPI", "Supabase", "SQLite", "Docker", "Git", "Redis"],
  },
];

const achievements: AchievementItem[] = [
  { title: "IEEEXtreme 18.0",              context: "Global Rank 542",   isKey: true  },
  { title: "LeetCode",                     context: "1830 Rating · Biweekly Rank 101", isKey: true },
  { title: "Smart Interviews GCET-2027-R", context: "Rank #1",           isKey: true  },
  { title: "GATE CSE 2026",               context: "AIR 9602",           isKey: false },
  { title: "Agentation 2025 Finalist",    context: "Agentic AI Hackathon, Malla Reddy", isKey: false },
  { title: "CTF Hackathon, Best Student", context: "Supraja Technologies (2025)", isKey: false },
];

const certifications: CertItem[] = [
  { name: "AWS Academy Graduate",             issuer: "AWS Academy",    signal: true  },
  { name: "Google Cloud Vertex AI",           issuer: "Google Cloud",   signal: true  },
  { name: "CCNA: Introduction to Networks",   issuer: "Cisco",          signal: false },
  { name: "MongoDB Associate Developer",      issuer: "MongoDB",        signal: false },
];

/* ─── Corner marks ───────────────────────────────────────────────────────── */
function CornerMarks() {
  return (
    <>
      <span aria-hidden="true" className="cc-tl" />
      <span aria-hidden="true" className="cc-tr" />
      <span aria-hidden="true" className="cc-bl" />
      <span aria-hidden="true" className="cc-br" />
    </>
  );
}

export default function StackSection() {
  return (
    <section id="stack" className="py-24 lg:py-32">
      <div className="section-wrap">

        {/* Section header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-[1px] h-3.5 bg-amber-500" />
          <span className="eyebrow">Technical Stack</span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold text-white mb-14"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.08 }}
        >
          Spec Sheet
        </h2>

        {/* 3-column skill grid with staggered pill reveals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {skillGroups.map((group, colIdx) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38, delay: colIdx * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="corner-card p-5 group hover:border-amber-500/40 transition-colors duration-200"
            >
              <CornerMarks />

              {/* Column header */}
              <div
                className="mono text-[9px] tracking-[0.14em] uppercase text-amber-500 mb-3.5 pb-2.5 border-b border-[var(--border)] font-semibold"
              >
                {group.label}
              </div>

              {/* Staggered Pills */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.02,
                    },
                  },
                }}
                className="flex flex-wrap gap-1.5"
              >
                {group.items.map(item => (
                  <motion.span
                    key={item}
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
                      },
                    }}
                    className={`tag ${group.variant} hover:!border-amber-500 hover:!text-amber-400 hover:!bg-amber-500/10 cursor-default transition-all duration-150`}
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Education + Achievements + Certs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

          {/* Left: Education + Achievements */}
          <div className="flex flex-col gap-8">

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <p className="mono text-[9px] tracking-[0.14em] uppercase text-amber-500 mb-3 font-semibold">
                Education
              </p>
              <div className="corner-card p-5 group hover:border-amber-500/40 transition-colors duration-200">
                <CornerMarks />
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-bold text-white group-hover:text-amber-100 transition-colors">
                    B.Tech — Computer Science & Engineering
                  </span>
                  <span className="text-[13px] text-[var(--muted)]">
                    Geethanjali College of Engineering and Technology
                  </span>
                  <div className="flex gap-4 mt-2">
                    <span className="mono text-[11px] text-[var(--muted)]">Grad 2027</span>
                    <span className="mono text-[11px] text-amber-400 font-medium">CGPA 7.49 / 10</span>
                    <span className="mono text-[11px] text-[var(--muted)]">Hyderabad, IN</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.06, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <p className="mono text-[9px] tracking-[0.14em] uppercase text-amber-500 mb-3 font-semibold">
                Competitive Highlights
              </p>
              <div className="corner-card overflow-hidden">
                <CornerMarks />
                {achievements.map((a, i) => (
                  <div
                    key={a.title}
                    className="flex items-center justify-between gap-3 px-5 py-3 border-b last:border-b-0 border-[var(--border)] transition-colors duration-150 hover:bg-amber-500/[0.04]"
                  >
                    <span className={`text-[13px] ${a.isKey ? "font-semibold text-white" : "text-[var(--muted)]"}`}>
                      {a.title}
                    </span>
                    <span
                      className={`mono text-[12px] shrink-0 text-right ${a.isKey ? "text-amber-400 font-semibold" : "text-[var(--muted)]"}`}
                    >
                      {a.context}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <p className="mono text-[9px] tracking-[0.14em] uppercase text-amber-500 mb-3 font-semibold">
              Certifications
            </p>
            <div className="corner-card overflow-hidden">
              <CornerMarks />
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className={`flex items-center justify-between gap-3 px-5 py-3.5 border-b last:border-b-0 border-[var(--border)] transition-all duration-150 hover:bg-amber-500/[0.04] ${
                    cert.signal ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {cert.signal && (
                      <span
                        className="w-1.5 h-1.5 bg-amber-500 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span className={`text-[13px] ${cert.signal ? "font-semibold text-white" : "text-[var(--muted)]"}`}>
                      {cert.name}
                    </span>
                  </div>
                  <span className="mono text-[11px] text-[var(--muted)] shrink-0">
                    {cert.issuer}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
