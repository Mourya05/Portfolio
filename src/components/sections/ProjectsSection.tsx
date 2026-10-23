"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa6";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface Project {
  title:       string;
  label:       string;
  description: string;
  tags:        string[];
  github:      string;
  image:       string;
  metric?:     { main: string; sub: string };
  overlayTag?: string;
}

interface CompactProject {
  title:  string;
  blurb:  string;
  tags:   string[];
  github: string;
  image?: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const featuredProject: Project = {
  title: "StrataKV — LLM Inference Engine",
  label: "ML systems",
  description:
    "From-scratch LLM inference engine in C++ and CUDA, built without ML frameworks. Runs Llama 2 (1.1B) on a 4 GB GTX 1050 Ti, achieving 34.13 tokens/sec decode and an 11.6 s model load time using vectorized loads and warp-level GEMV.",
  tags: ["C++", "CUDA", "LLM Inference", "Systems"],
  github: "https://github.com/Mourya05/StrataKV",
  image: "/projects/StrataKV.png",
  metric: {
    main: "34.13 tok/s",
    sub: "Llama 2 (1.1B) · 4 GB GTX 1050 Ti",
  },
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

/* ─── Chamfered Spotlight Wrapper ────────────────────────────────────────── */
function ChamferSpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`chamfer-card spotlight-card ${className}`}
    >
      <div className="chamfer-card-inner flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}

function ProjectCover({ project }: { project: Project }) {
  const isTerminal = project.image.includes("StrataKV");

  return (
    <div
      className="relative w-full aspect-[16/10] overflow-hidden select-none bg-[#050608] flex flex-col"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {isTerminal ? (
        <div className="relative w-full h-full flex flex-col z-10 bg-[#05050a]">
          {/* Terminal Window Header */}
          <div className="h-7 px-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#352b4d]" />
              <span className="w-2 h-2 rounded-full bg-[#352b4d]" />
              <span className="w-2 h-2 rounded-full bg-[#352b4d]" />
            </div>
            <span className="mono text-[10px] text-[var(--muted)]">
              MINGW64 · stratakv_cli.exe
            </span>
            <span className="w-8" />
          </div>

          {/* Terminal Content: Full image visible via object-contain without cropping */}
          <div className="relative flex-1 w-full flex items-center justify-center p-3 sm:p-5">
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
          {/* Actual Project Image */}
          <div className="relative w-full h-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Faint Violet Gradient over bottom of screenshot for palette unity */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(7, 6, 12, 0.95) 0%, rgba(124, 58, 237, 0.12) 35%, transparent 75%)",
            }}
          />
        </>
      )}

      {/* Floating Status / Metric Chip */}
      {project.metric ? (
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 backdrop-blur-md bg-[rgba(16,13,25,0.85)] border border-[var(--border-strong)]">
          <span className="mono text-xs font-semibold text-[var(--accent)]">
            {project.metric.main}
          </span>
          <span className="mono text-[10px] text-[var(--muted)]">
            · {project.metric.sub}
          </span>
        </div>
      ) : project.overlayTag ? (
        <div className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 backdrop-blur-md bg-[rgba(16,13,25,0.85)] border border-[var(--border-strong)]">
          <span className="w-1.5 h-1.5 bg-[var(--accent)]" />
          <span className="mono text-[10px] font-medium text-[var(--text)]">
            {project.overlayTag}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 lg:py-28">
      <div className="section-wrap">
        
        {/* 4.3 Eyebrow: Chamfered square + Label + Hairline */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="w-2 h-2 shrink-0 bg-[var(--accent)]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
          />
          <span className="mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Projects
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="tracking-tight text-white font-semibold mb-12"
          style={{
            fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
            lineHeight: 1.1,
          }}
        >
          Featured Work
        </h2>

        {/* 1. Featured Project: Full Width (Cover Left 55%, Text Right 45% on desktop) */}
        <div className="mb-10">
          <ChamferSpotlightCard className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-stretch">
              {/* Cover Left */}
              <div className="flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                <ProjectCover project={featuredProject} />
              </div>
              
              {/* Text Right */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="mono text-[11px] text-[var(--accent)] uppercase tracking-wider font-semibold">
                      {featuredProject.label}
                    </span>
                    <a
                      href={featuredProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-xs text-[var(--muted)] hover:text-white inline-flex items-center gap-1.5 transition-colors"
                      aria-label="View StrataKV on GitHub"
                    >
                      <FaGithub size={14} />
                      <span>Code</span>
                    </a>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                    {featuredProject.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-6">
                    {featuredProject.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                  {featuredProject.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </ChamferSpotlightCard>
        </div>

        {/* 2. Grid Projects: 2 Columns on Desktop, Equal Heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {gridProjects.map((p) => (
            <ChamferSpotlightCard key={p.title} className="flex flex-col h-full">
              {/* 16:10 Cover Tile */}
              <ProjectCover project={p} />

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="mono text-[11px] text-[var(--muted)] uppercase tracking-wider">
                      {p.label}
                    </span>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-xs text-[var(--muted)] hover:text-white inline-flex items-center gap-1.5 transition-colors"
                      aria-label={`View ${p.title} on GitHub`}
                    >
                      <FaGithub size={13} />
                      <span>Code</span>
                    </a>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </ChamferSpotlightCard>
          ))}
        </div>

        {/* 3. More Projects: Chamfered Box Rows */}
        <div>
          <h3 className="mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
            More Projects
          </h3>
          <div className="chamfer-card">
            <div className="chamfer-card-inner divide-y divide-[var(--border)]">
              {compactProjects.map((cp) => (
                <div
                  key={cp.title}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {cp.image && (
                      <div className="relative w-12 h-12 overflow-hidden shrink-0 border border-[var(--border)] hidden sm:block bg-[#050608]">
                        <Image
                          src={cp.image}
                          alt={cp.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col sm:max-w-lg">
                      <h4 className="text-sm font-semibold text-white">
                        {cp.title}
                      </h4>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        {cp.blurb}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="flex flex-wrap gap-1.5">
                      {cp.tags.map((t) => (
                        <span key={t} className="tag text-[10px] py-0.5 px-2">
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={cp.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--muted)] hover:text-white transition-colors"
                      aria-label={`View ${cp.title} on GitHub`}
                    >
                      <FaGithub size={15} />
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
