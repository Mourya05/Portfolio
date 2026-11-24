"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Experience {
  company:  string;
  role:     string;
  period:   string;
  type:     string;
  tags:     string[];
  bullets:  string[];
}

interface Leadership {
  role:    string;
  org:     string;
  period:  string;
  active:  boolean;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const experiences: Experience[] = [
  {
    company: "Nucleonix Systems",
    role:    "Software Engineer Intern",
    period:  "Feb 2026 – Jun 2026",
    type:    "On-Site · Hyderabad",
    tags:    ["React Native", "BLE/NUS", "Arduino", "SQLite", "Supabase", "Node.js"],
    bullets: [
      "Built the Tab-Based GM Counting System — a cross-platform tablet app for real-time Geiger-Muller radiation monitoring with live dose-rate readouts.",
      "Integrated Nordic UART Service (NUS) BLE communication between the React Native app and Arduino-based GM detector hardware; handled packet framing and error recovery.",
      "Designed on-device SQLite schema for timestamped radiation logs and built a Node.js / Supabase sync pipeline for cloud backup and analytics.",
    ],
  },
  {
    company: "Avasan Chakra",
    role:    "Software Development Engineer Intern",
    period:  "Apr 2026 – May 2026",
    type:    "Remote · Startup",
    tags:    ["Algorithms", "Python", "Sustainable Tech"],
    bullets: [
      "Contributed algorithmic solutions for load-balancing and scheduling systems in a startup targeting energy efficiency for high-rise building infrastructure.",
      "Shipped two modules: a resource-allocation optimizer and a predictive maintenance flag system integrated into the existing Python codebase.",
    ],
  },
  {
    company: "Supraja Technologies",
    role:    "Security & Backend Intern",
    period:  "May 2025 – Aug 2025",
    type:    "On-Site · Vijayawada",
    tags:    ["Python", "Multiprocessing", "SQL", "Kali Linux", "OSINT"],
    bullets: [
      "Built a multiprocessing Python engine for automated hash validation and structured log parsing, reducing batch processing time by ~3× on 4-core hardware.",
      "Designed and maintained SQL ETL pipelines for aggregating security event data from disparate network sources into a normalized reporting schema.",
      "Conducted hands-on network security assessments (passive reconnaissance, traffic analysis) in isolated lab environments using Kali Linux tooling.",
    ],
  },
  {
    company: "Agnirva",
    role:    "AI Intern",
    period:  "Apr 2025 – Jun 2025",
    type:    "Remote · Space-Tech AI",
    tags:    ["Generative AI", "Python", "Prompt Engineering", "LLM Fine-tuning"],
    bullets: [
      "Contributed to AI research pipelines for space-domain applications, including dataset curation, prompt engineering for instruction-tuned models, and evaluation harness development.",
      "Prototyped an LLM-based Q&A system for internal knowledge retrieval, integrating retrieval-augmented generation (RAG) over technical documentation.",
    ],
  },
];

const leadership: Leadership[] = [
  { role: "PR Head",                       org: "GCET Coding Club",             period: "Dec 2024 – Jun 2026", active: true  },
  { role: "Webmaster",                     org: "IEEE Education Society",        period: "Aug 2025 – Dec 2025", active: false },
  { role: "Google Student Dev Ambassador", org: "Google",                       period: "Jul 2025 – Dec 2025", active: false },
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

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Progressive scroll-linked vertical track fill
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 50%"],
  });

  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 300,
    damping: 35,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="py-24 lg:py-32">
      <div className="section-wrap">

        {/* Section header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-[1px] h-3.5 bg-amber-500" />
          <span className="eyebrow">Experience Log</span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold text-white mb-14"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.08 }}
        >
          Internships
        </h2>

        {/* Timeline wrapper with live scroll-linked vertical track */}
        <div ref={containerRef} className="relative flex flex-col mb-16">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.company + exp.period}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as const }}
              className="timeline-entry group"
            >
              <div
                className="grid grid-cols-1 md:grid-cols-[160px_24px_1fr] md:gap-x-8"
                style={{ paddingBottom: idx < experiences.length - 1 ? 44 : 0 }}
              >
                {/* Date column */}
                <div className="md:text-right pt-1 pb-2 md:pb-0">
                  <span className="mono text-xs text-[var(--muted)] tracking-wider block group-hover:text-amber-400 transition-colors">
                    {exp.period}
                  </span>
                  <span className="mono text-[10px] text-[var(--subtle)] tracking-wide">
                    {exp.type}
                  </span>
                </div>

                {/* Spine column (desktop only) with live track and glowing node */}
                <div className="hidden md:flex flex-col items-center self-stretch relative">
                  {/* Timeline Node Dot */}
                  <motion.span
                    initial={{ backgroundColor: "var(--border-mid)", scale: 0.8 }}
                    whileInView={{
                      backgroundColor: "var(--amber)",
                      scale: 1,
                      boxShadow: "0 0 10px rgba(245, 158, 11, 0.6)",
                    }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.25 }}
                    className="w-2 h-2 shrink-0 z-10 transition-colors"
                  />

                  {/* Vertical spine line with progressive fill */}
                  {idx < experiences.length - 1 && (
                    <div className="w-[1px] flex-1 bg-[var(--border)] relative mt-2">
                      <motion.div
                        style={{ scaleY }}
                        className="w-[1px] bg-amber-500 absolute inset-0 origin-top"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <div className="flex flex-wrap items-baseline gap-2 mb-2.5">
                    <h3 className="text-[17px] font-bold text-white m-0 group-hover:text-amber-200 transition-colors">
                      {exp.role}
                    </h3>
                    <span className="text-sm text-[var(--muted)]">· {exp.company}</span>
                  </div>

                  <ul className="list-none p-0 m-0 mb-3.5 flex flex-col gap-2">
                    {exp.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[var(--muted)] leading-relaxed"
                      >
                        <span className="text-amber-500 shrink-0 mt-1 text-[9px]">▶</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map(t => (
                      <span key={t} className="tag transition-colors hover:border-amber-500/50">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leadership — compact table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="eyebrow text-[var(--muted)]">Leadership & Community</span>
            <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
          </div>

          <div className="corner-card overflow-hidden">
            <CornerMarks />
            {leadership.map((l, i) => (
              <div
                key={l.org + l.period}
                className="group flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3.5 border-b last:border-b-0 border-[var(--border)] transition-colors duration-150 hover:bg-amber-500/[0.03] cursor-default"
              >
                <div className="flex items-center gap-2.5">
                  {l.active && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse"
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-sm font-semibold text-white group-hover:text-amber-100 transition-colors">{l.role}</span>
                  <span className="text-[13px] text-[var(--muted)]">— {l.org}</span>
                </div>
                <span className="mono text-[11px] text-[var(--subtle)] tracking-wide">
                  {l.period}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
