"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface StatItem { label: string; value: number; unit: string; decimals: number }

interface Project {
  title:       string;
  label:       string;
  description: string;
  tags:        string[];
  github:      string;
  image:       string;
  stats?:      StatItem[];
  overlayTag?: string;
}

interface CompactProject {
  title:  string;
  blurb:  string;
  tags:   string[];
  github: string;
  image?: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const featuredProject: Project = {
  title: "StrataKV — LLM Inference Engine",
  label: "ML Systems",
  description:
    "From-scratch LLM inference engine in C++ and CUDA, built without ML frameworks. Runs Llama 2 (1.1B) on a 4 GB GTX 1050 Ti, achieving 34.13 tokens/sec decode and an 11.6 s model load time using vectorized loads and warp-level GEMV.",
  tags: ["C++", "CUDA", "LLM Inference", "Systems"],
  github: "https://github.com/Mourya05/StrataKV",
  image: "/projects/StrataKV.png",
  stats: [
    { label: "Decode speed",   value: 34.13, unit: "tok/s",  decimals: 2 },
    { label: "Model load",     value: 11.6,  unit: "s",      decimals: 1 },
    { label: "Model size",     value: 1.1,   unit: "B params · 4 GB GPU", decimals: 1 },
  ],
};

const gridProjects: Project[] = [
  {
    title: "NeuralMesh",
    label: "Prototype",
    description:
      "Graph attention network (PyTorch Geometric) over pending Ethereum transactions to flag suspicious MEV patterns, paired with a FastAPI backend and WebGL visualizer.",
    tags: ["PyTorch Geometric", "FastAPI", "GAT", "Python", "WebGL"],
    github: "https://github.com/Mourya05/neuralmesh",
    image: "/projects/NeuralMesh.png",
    overlayTag: "GAT Threat Visualizer",
  },
  {
    title: "Tab-Based GM Counting System",
    label: "Mobile App",
    description:
      "Tablet app for a Geiger-Muller radiation detector built during my Nucleonix internship. Integrates Nordic UART Service (NUS) BLE communication, on-device SQLite storage, and a Node.js/Supabase backend.",
    tags: ["React Native", "BLE", "SQLite", "Node.js", "Supabase"],
    github: "https://github.com/Mourya05/gm-counting-system",
    image: "/projects/Nucloenix_screen.png",
    overlayTag: "Nucleonix BLE Tablet UI",
  },
  {
    title: "Probabilistic Character Recognition",
    label: "Machine Learning",
    description:
      "Character recognition via recursive Bayesian updating in R. Features Maximum A Posteriori (MAP) estimation and a 0.85 posterior stopping threshold.",
    tags: ["R", "Bayesian Inference", "MAP", "Statistics"],
    github: "https://github.com/Mourya05/probabilistic-char-recognition",
    image: "/projects/Prob_Char_recog.png",
    overlayTag: "Bayesian MAP Engine (R)",
  },
  {
    title: "Student Attendance System",
    label: "Computer Vision",
    description:
      "Automated attendance pipeline using OpenCV and face recognition for identity verification, logging timestamped records into a SQL database.",
    tags: ["Python", "OpenCV", "Face Recognition", "SQL"],
    github: "https://github.com/Mourya05/attendance-system",
    image: "/projects/Student_Attendance.png",
    overlayTag: "OpenCV Facial Verification",
  },
];

const compactProjects: CompactProject[] = [
  {
    title: "Air Canvas",
    blurb: "Real-time motion tracking app allowing drawing via finger landmarks with OpenCV and MediaPipe.",
    tags: ["Python", "OpenCV", "MediaPipe"],
    github: "https://github.com/Mourya05",
    image: "/projects/Air_Canvas.png",
  },
  {
    title: "Hobby OS",
    blurb: "Custom 32-bit x86 operating system kernel with paging, heap allocator, and system calls.",
    tags: ["C", "NASM", "x86", "Systems"],
    github: "https://github.com/Mourya05/hobby-os",
    image: "/projects/Hobby_OS.png",
  },
  {
    title: "Eat-IQ",
    blurb: "Nutrition tracking application with daily caloric, macro, and hydration dashboards.",
    tags: ["React", "Node.js", "SQLite"],
    github: "https://github.com/Mourya05/eat-iq",
  },
  {
    title: "Custom POSIX Shell",
    blurb: "Minimal Unix shell in C supporting process management, pipelines, and I/O redirection.",
    tags: ["C", "POSIX", "Systems"],
    github: "https://github.com/Mourya05/custom-shell",
  },
];

/* ─── Count-up hook ──────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800, decimals = 2) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    // respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [started, target, duration, decimals]);

  return { count, ref };
}

/* ─── In-view hook ───────────────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Spotlight wrapper ──────────────────────────────────────────────────────── */
function SpotlightProjectCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }
  return (
    <div onMouseMove={handleMouseMove} className={`project-card spotlight-card ${className}`}>
      <div className="project-card-inner flex flex-col h-full">{children}</div>
    </div>
  );
}

/* ─── StrataKV stat row ──────────────────────────────────────────────────────── */
function StrataStat({ stat, isFirst }: { stat: StatItem; isFirst: boolean }) {
  const { count, ref } = useCountUp(stat.value, 1800, stat.decimals);
  return (
    <div ref={ref} className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span
          className="mono font-bold"
          style={{
            fontSize: isFirst ? "clamp(2rem, 4vw, 2.8rem)" : "clamp(1.4rem, 2.5vw, 1.8rem)",
            lineHeight: 1,
            background: isFirst ? "linear-gradient(90deg, var(--violet-hi), var(--crimson))" : undefined,
            WebkitBackgroundClip: isFirst ? "text" : undefined,
            WebkitTextFillColor: isFirst ? "transparent" : undefined,
            backgroundClip: isFirst ? "text" : undefined,
            color: isFirst ? "transparent" : "var(--violet-hi)",
          }}
        >
          {count.toFixed(stat.decimals)}
        </span>
        <span
          className="mono font-semibold"
          style={{
            fontSize: isFirst ? "14px" : "12px",
            color: isFirst ? "var(--red)" : "var(--muted)",
            borderBottom: isFirst ? "1.5px solid var(--red)" : "none",
            lineHeight: 1.2,
            paddingBottom: isFirst ? "1px" : 0,
          }}
        >
          {stat.unit}
        </span>
      </div>
      <span className="mono" style={{ fontSize: "11px", color: "var(--muted)" }}>
        {stat.label}
      </span>
    </div>
  );
}

/* ─── Image cover with tint overlay ──────────────────────────────────────────── */
function ProjectCover({ project }: { project: Project }) {
  const isTerminal = project.image.includes("StrataKV");

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        aspectRatio: "16/10",
        background: "#050608",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {isTerminal ? (
        /* Terminal window */
        <div className="relative w-full h-full flex flex-col bg-[#05050a]">
          {/* Title bar */}
          <div
            className="h-7 px-3 flex items-center justify-between"
            style={{
              borderBottom: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#352b4d" }} />
              <span className="w-2 h-2 rounded-full" style={{ background: "#352b4d" }} />
              <span className="w-2 h-2 rounded-full" style={{ background: "#352b4d" }} />
            </div>
            <span className="mono" style={{ fontSize: "10px", color: "var(--muted)" }}>
              MINGW64 · stratakv_cli.exe
            </span>
            <span className="w-8" />
          </div>

          {/* Screenshot with blinking cursor */}
          <div className="relative flex-1 w-full flex items-center justify-center p-3 sm:p-5 blink-cursor">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-2 sm:p-4"
              priority
            />
          </div>
        </div>
      ) : (
        <>
          {/* Photo with consistent saturation */}
          <div className="relative w-full h-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              style={{ filter: "saturate(0.82)" }}
            />
          </div>

          {/* Bottom fade + violet tint layer */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(5,5,8,0.92) 0%, rgba(139,92,246,0.10) 40%, transparent 75%)",
            }}
          />

          {/* Violet colour tint — kills over-saturated screenshots */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "rgba(139,92,246,0.10)",
              mixBlendMode: "color",
            }}
          />
        </>
      )}

      {/* Overlay tag for grid cards */}
      {project.overlayTag && (
        <div
          className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 backdrop-blur-md"
          style={{
            background: "rgba(13,11,20,0.86)",
            border: "1px solid var(--border-strong)",
          }}
        >
          <span className="w-1.5 h-1.5" style={{ background: "var(--violet)" }} />
          <span className="mono" style={{ fontSize: "10px", fontWeight: 500, color: "var(--text)" }}>
            {project.overlayTag}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────────────────────────── */
export default function ProjectsSection() {
  const { ref: gridRef, visible: gridVisible } = useInView(0.08);

  return (
    <section id="projects" className="py-28 lg:py-36">
      <div className="section-wrap">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 shrink-0" style={{ background: "var(--violet)", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }} />
          <span className="eyebrow">Projects</span>
          <div className="flex-1 h-px ml-2" style={{ background: "var(--border)" }} />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold mb-14"
          style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", lineHeight: 1.08, color: "white" }}
        >
          Featured Work
        </h2>

        {/* 1. Featured — full-width */}
        <div className="mb-12">
          <SpotlightProjectCard className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-stretch">
              {/* Cover left */}
              <div className="flex items-stretch border-b lg:border-b-0 lg:border-r" style={{ borderColor: "var(--border)" }}>
                <div className="w-full">
                  <ProjectCover project={featuredProject} />
                </div>
              </div>

              {/* Text right */}
              <div className="p-7 sm:p-9 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="label-pill">{featuredProject.label}</span>
                    <a
                      href={featuredProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono inline-flex items-center gap-1.5 transition-colors"
                      style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none" }}
                      aria-label="View StrataKV on GitHub"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
                    >
                      <FaGithub size={14} />
                      <span>Code</span>
                    </a>
                  </div>
                  <h3 className="font-semibold text-white mb-4" style={{ fontSize: "clamp(1.15rem, 2vw, 1.4rem)" }}>
                    {featuredProject.title}
                  </h3>
                  <p className="leading-relaxed mb-7" style={{ fontSize: "16px", color: "var(--muted)" }}>
                    {featuredProject.description}
                  </p>

                  {/* Stat row — three large mono numbers */}
                  {featuredProject.stats && (
                    <div
                      className="grid gap-5 py-6 px-5 mb-2"
                      style={{
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        background: "rgba(139,92,246,0.06)",
                        border: "1px solid rgba(139,92,246,0.18)",
                      }}
                    >
                      {featuredProject.stats.map((s, i) => (
                        <StrataStat key={s.label} stat={s} isFirst={i === 0} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  {featuredProject.tags.map((t) => (
                    <span key={t} className="tag tag-systems">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightProjectCard>
        </div>

        {/* 2. Grid — staggered fade */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-18"
          style={{ marginBottom: "72px" }}
        >
          {gridProjects.map((p, idx) => (
            <div
              key={p.title}
              className={`in-view-fade stagger-${idx + 1} ${gridVisible ? "visible" : ""}`}
            >
              <SpotlightProjectCard className="flex flex-col h-full">
                <ProjectCover project={p} />

                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="label-pill">{p.label}</span>
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono inline-flex items-center gap-1.5 transition-colors"
                        style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none" }}
                        aria-label={`View ${p.title} on GitHub`}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
                      >
                        <FaGithub size={13} />
                        <span>Code</span>
                      </a>
                    </div>
                    <h3 className="font-semibold text-white mb-2" style={{ fontSize: "1.1rem" }}>
                      {p.title}
                    </h3>
                    <p className="leading-relaxed mb-6" style={{ fontSize: "15px", color: "var(--muted)" }}>
                      {p.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    {p.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </SpotlightProjectCard>
            </div>
          ))}
        </div>

        {/* 3. More Projects */}
        <div>
          <h3 className="eyebrow mb-4" style={{ color: "var(--muted)" }}>
            More Projects
          </h3>
          <div className="chamfer-card">
            <div className="chamfer-card-inner divide-y divide-[var(--border)]">
              {compactProjects.map((cp) => (
                <div
                  key={cp.title}
                  className="more-row flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{ padding: "16px 20px" }}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {cp.image && (
                      <div
                        className="relative w-12 h-12 overflow-hidden shrink-0 hidden sm:block"
                        style={{ border: "1px solid var(--border)", background: "#050608" }}
                      >
                        <Image src={cp.image} alt={cp.title} fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col sm:max-w-lg">
                      <h4 className="more-row-title font-semibold transition-colors" style={{ fontSize: "14px", color: "white" }}>
                        {cp.title}
                      </h4>
                      <p className="more-row-blurb mt-1 transition-colors" style={{ fontSize: "13px", color: "var(--muted)" }}>
                        {cp.blurb}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="flex flex-wrap gap-1.5">
                      {cp.tags.map((t) => (
                        <span key={t} className="tag" style={{ fontSize: "11px", padding: "2px 8px" }}>{t}</span>
                      ))}
                    </div>
                    <a
                      href={cp.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--muted)" }}
                      className="transition-colors"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
                      aria-label={`View ${cp.title} on GitHub`}
                    >
                      <FaGithub size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
