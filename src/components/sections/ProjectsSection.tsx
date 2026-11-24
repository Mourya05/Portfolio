"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import { motion } from "framer-motion";
import TelemetryNumber from "@/components/TelemetryNumber";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface StatItem {
  label: string;
  value: number;
  unit: string;
  decimals: number;
}

interface FeaturedProject {
  idx: string;
  title: string;
  subtitle: string;
  description: string;
  architecture: string[];
  tags: string[];
  tagVariant: string;
  github: string;
  live?: string;
  image: string;
  stats?: StatItem[];
  isTerminal?: boolean;
}

interface BentoProject {
  idx: string;
  title: string;
  description: string;
  tags: string[];
  tagVariant: string;
  github: string;
  live?: string;
  image?: string;
}

interface CompactProject {
  year: string;
  title: string;
  stack: string;
  github: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const featuredProject: FeaturedProject = {
  idx: "01",
  title: "StrataKV",
  subtitle: "CUDA LLM Inference Engine",
  description:
    "From-scratch LLM inference engine in C++ and CUDA — no ML frameworks. Runs Llama 2 (1.1B) on a 4 GB GTX 1050 Ti. Implements vectorized loads, warp-level GEMV, and custom tokenizer.",
  architecture: [
    "Custom CUDA kernels",
    "Warp-level GEMV",
    "BPE tokenizer",
    "Memory-mapped weights",
    "GTX 1050 Ti · 4 GB VRAM",
  ],
  tags: ["C++", "CUDA", "LLM Inference", "x86 Systems"],
  tagVariant: "tag-systems",
  github: "https://github.com/Mourya05/StrataKV",
  image: "/projects/StrataKV.png",
  stats: [
    { label: "Decode speed", value: 34.13, unit: "tok/s", decimals: 2 },
    { label: "Model load",   value: 11.6,  unit: "s",     decimals: 1 },
    { label: "Model size",   value: 1.1,   unit: "B params", decimals: 1 },
  ],
  isTerminal: true,
};

const bentoProjects: BentoProject[] = [
  {
    idx: "02",
    title: "Hobby OS",
    description:
      "Bare-metal 32-bit x86 operating system kernel in C and NASM. Implements paging (4 KB pages), a first-fit heap allocator, interrupt descriptor tables, and kernel-mode system calls.",
    tags: ["C", "NASM", "x86", "Paging", "IDT"],
    tagVariant: "tag-systems",
    github: "https://github.com/Mourya05/hobby-os",
    image: "/projects/Hobby_OS.png",
  },
  {
    idx: "03",
    title: "NeuralMesh",
    description:
      "Graph Attention Network (PyTorch Geometric) over live Ethereum mempool transactions to flag suspicious MEV patterns. Pairs with a FastAPI backend and WebGL transaction visualizer.",
    tags: ["PyTorch Geometric", "FastAPI", "GAT", "WebGL"],
    tagVariant: "tag-ml",
    github: "https://github.com/Mourya05/neuralmesh",
    image: "/projects/NeuralMesh.png",
  },
  {
    idx: "04",
    title: "Tab-Based GM Counting System",
    description:
      "Tablet app for a Geiger-Muller radiation detector. BLE via Nordic UART Service (NUS) to Arduino-based hardware, on-device SQLite storage, Node.js + Supabase backend. Built at Nucleonix.",
    tags: ["React Native", "BLE/NUS", "SQLite", "Node.js", "Supabase"],
    tagVariant: "tag-systems",
    github: "https://github.com/Mourya05/gm-counting-system",
    image: "/projects/Nucloenix_screen.png",
  },
];

const compactProjects: CompactProject[] = [
  { year: "2025", title: "Probabilistic Character Recognition", stack: "R · Bayesian Inference · MAP",        github: "https://github.com/Mourya05/probabilistic-char-recognition" },
  { year: "2025", title: "Student Attendance System",          stack: "Python · OpenCV · Face Recognition",   github: "https://github.com/Mourya05/attendance-system"              },
  { year: "2024", title: "Air Canvas",                         stack: "Python · OpenCV · MediaPipe",           github: "https://github.com/mourya05"                               },
  { year: "2024", title: "Eat-IQ",                             stack: "React · Node.js · SQLite",              github: "https://github.com/Mourya05/eat-iq"                         },
  { year: "2024", title: "Custom POSIX Shell",                 stack: "C · POSIX · Process management",        github: "https://github.com/Mourya05/custom-shell"                   },
];

/* ─── Corner marks helper with hover expansion ────────────────────────────── */
function CornerMarks() {
  return (
    <>
      <span aria-hidden="true" className="cc-tl transition-all duration-200 group-hover:border-amber-400 group-hover:opacity-100" />
      <span aria-hidden="true" className="cc-tr transition-all duration-200 group-hover:border-amber-400 group-hover:opacity-100" />
      <span aria-hidden="true" className="cc-bl transition-all duration-200 group-hover:border-amber-400 group-hover:opacity-100" />
      <span aria-hidden="true" className="cc-br transition-all duration-200 group-hover:border-amber-400 group-hover:opacity-100" />
    </>
  );
}

/* ─── Mouse move for card spotlight ───────────────────────────────────────── */
function handleCardMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
}

/* ─── Bento Card ─────────────────────────────────────────────────────────── */
function BentoCard({ project }: { project: BentoProject }) {
  return (
    <div
      onMouseMove={handleCardMouseMove}
      className="corner-card group relative flex flex-col h-full overflow-hidden transition-colors duration-200 hover:border-amber-500/40"
    >
      <CornerMarks />

      {/* Mouse-tracking radial gradient border/surface glow (12-15% amber) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background:
            "radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(245, 158, 11, 0.14), transparent 75%)",
        }}
      />

      {/* Media: Image inside overflow-hidden container with smooth scale: 1 -> 1.03 */}
      {project.image && (
        <div
          className="relative overflow-hidden shrink-0 border-b border-[var(--border)]"
          style={{
            aspectRatio: "16/9",
            background: "#050810",
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center filter saturate-[0.8] brightness-90 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          {/* Overlay gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(13,16,22,0.95) 0%, transparent 60%)" }}
          />
          {/* Index tag */}
          <span
            className="mono absolute z-10 top-2 left-2.5 text-[9px] tracking-[0.1em] text-amber-500 uppercase font-semibold"
          >
            {project.idx}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-2 relative z-20">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[15px] font-bold text-[var(--text)] leading-snug m-0 group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mono inline-flex items-center gap-1.5 text-[11px] text-[var(--muted)] hover:text-white transition-colors shrink-0"
            aria-label={`GitHub — ${project.title}`}
          >
            <FaGithub size={13} />
          </a>
        </div>
        <p className="text-[13px] text-[var(--muted)] leading-relaxed m-0 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-[var(--border)]">
          {project.tags.map(t => (
            <span key={t} className={`tag ${project.tagVariant} transition-colors hover:border-amber-500/50`}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────────────────────── */
export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="section-wrap">

        {/* Section header */}
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-[1px] h-3.5 bg-amber-500" />
          <span className="eyebrow">Featured Engineering Work</span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold text-white mb-14"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.08 }}
        >
          Projects
        </h2>

        {/* ── 01: StrataKV — full width featured card with mouse glow & telemetry numbers ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-6"
        >
          <div
            onMouseMove={handleCardMouseMove}
            className="corner-card group relative overflow-hidden transition-colors duration-200 hover:border-amber-500/50"
          >
            <CornerMarks />

            {/* Mouse-tracking radial gradient glow (14% amber) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              style={{
                background:
                  "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(245, 158, 11, 0.14), transparent 70%)",
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] relative z-20">

              {/* Terminal preview container */}
              <div className="border-b lg:border-b-0 lg:border-r border-[var(--border)] overflow-hidden">
                <div className="flex flex-col bg-[#05070a] h-full min-h-[240px]">
                  {/* Title bar */}
                  <div className="mono flex items-center justify-between px-3 h-7 border-b border-[var(--border)] bg-[var(--surface)] text-[10px] text-[var(--muted)] shrink-0">
                    <div className="flex gap-1.5">
                      {["#382414", "#243814", "#142838"].map((c, i) => (
                        <span key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <span>stratakv_inference · MINGW64</span>
                    <span className="w-8" />
                  </div>
                  {/* Image with subtle scale on hover */}
                  <div className="relative flex-1 min-h-[200px] overflow-hidden">
                    <Image
                      src={featuredProject.image}
                      alt={featuredProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-contain p-3 sm:p-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <div className="p-6 sm:p-8 flex flex-col justify-between gap-5">
                <div>
                  {/* Index + link */}
                  <div className="flex justify-between items-center mb-3.5">
                    <span className="mono text-[10px] text-amber-500 tracking-[0.1em] font-semibold">
                      {featuredProject.idx} · ML SYSTEMS
                    </span>
                    <a
                      href={featuredProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono inline-flex items-center gap-1.5 text-[11px] text-[var(--muted)] hover:text-white transition-colors"
                      aria-label="StrataKV on GitHub"
                    >
                      <FaGithub size={13} />
                      <span>GitHub</span>
                    </a>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight group-hover:text-amber-100 transition-colors">
                    {featuredProject.title}
                  </h3>
                  <p className="mono text-xs text-amber-500 tracking-[0.06em] mb-3.5 font-medium">
                    {featuredProject.subtitle}
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                    {featuredProject.description}
                  </p>

                  {/* Architecture summary */}
                  <div className="p-2.5 sm:p-3 bg-[var(--surface)] border border-[var(--border)] mb-4">
                    <p className="mono text-[9px] tracking-[0.12em] text-[var(--subtle)] uppercase mb-1.5">
                      Architecture
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredProject.architecture.map(a => (
                        <span key={a} className="mono text-[11px] text-[var(--muted)]">
                          · {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benchmark stats using TelemetryNumber */}
                  {featuredProject.stats && (
                    <div className="grid grid-cols-3 gap-3 p-3 bg-amber-500/5 border border-amber-500/20 mb-3">
                      {featuredProject.stats.map(s => (
                        <div key={s.label} className="flex flex-col gap-0.5">
                          <div className="flex items-baseline gap-1">
                            <span className="mono text-lg sm:text-2xl font-bold text-amber-400 leading-none">
                              <TelemetryNumber value={s.value} decimals={s.decimals} duration={0.6} />
                            </span>
                            <span className="mono text-[10px] sm:text-xs text-[var(--muted)]">{s.unit}</span>
                          </div>
                          <span className="mono text-[9px] sm:text-[10px] text-[var(--subtle)] tracking-[0.05em]">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border)]">
                  {featuredProject.tags.map(t => (
                    <span key={t} className={`tag ${featuredProject.tagVariant}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 02-04: Staggered Bento Grid Reveal ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14"
        >
          {bentoProjects.map((p) => (
            <motion.div
              key={p.idx}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
                },
              }}
              className="h-full"
            >
              <BentoCard project={p} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── More Projects: Compact Index Table with Interactive Hover ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="eyebrow text-[var(--muted)]">More Projects</span>
            <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
          </div>

          <div className="corner-card overflow-hidden">
            <CornerMarks />

            {/* Table header */}
            <div
              className="mono grid grid-cols-[56px_1fr_1fr_32px] gap-x-4 px-5 py-2 border-b border-[var(--border)] bg-[var(--surface)] text-[9px] tracking-[0.12em] uppercase text-[var(--subtle)]"
            >
              <span>Year</span>
              <span>Project</span>
              <span>Stack</span>
              <span className="text-center">Repo</span>
            </div>

            {/* Rows with animated left border accent, title shift, and icon rotate */}
            {compactProjects.map((cp, i) => (
              <div
                key={cp.title}
                className="group relative mono grid grid-cols-[56px_1fr_1fr_32px] gap-x-4 px-5 py-3 items-center border-b last:border-b-0 border-[var(--border)] transition-colors duration-150 hover:bg-amber-500/[0.03]"
              >
                {/* 2px amber left-border accent sliding down on hover */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top pointer-events-none"
                />

                <span className="text-[11px] text-[var(--subtle)]">{cp.year}</span>

                {/* Project title shifts 4px right */}
                <span className="text-[13px] text-[var(--text)] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-white">
                  {cp.title}
                </span>

                <span className="text-[11px] text-[var(--muted)]">{cp.stack}</span>

                {/* GitHub icon rotates slightly and brightens */}
                <a
                  href={cp.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted)] flex justify-center transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-12 group-hover:scale-110 group-hover:text-amber-400"
                  aria-label={`GitHub — ${cp.title}`}
                >
                  <FaGithub size={13} />
                </a>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
