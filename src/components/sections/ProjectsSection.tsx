"use client";

import { useEffect, useRef } from "react";
import { FaGithub } from "react-icons/fa";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface FeaturedProject {
  title:       string;
  description: string;
  tags:        string[];
  github:      string;
  demo?:       string;
}

interface OtherProject {
  title:  string;
  blurb:  string;
  tags:   string[];
  github: string;
  note?:  string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const featured: FeaturedProject[] = [
  {
    title: "StrataKV — LLM Inference Engine",
    description:
      "A from-scratch LLM inference engine in C++ and CUDA, built without ML frameworks. Runs Llama 2 (1.1B parameters) on a GTX 1050 Ti (4 GB VRAM), achieving 34.13 tokens/sec decode and an 11.6 s model load time. Uses vectorized loads and warp-level GEMV to keep memory bandwidth in check.",
    tags: ["C++17", "CUDA", "GEMV", "Llama 2", "Linux"],
    github: "https://github.com/Mourya05/StrataKV",
  },
  {
    title: "Hobby OS — x86 Kernel",
    description:
      "A 32-bit x86 hobby kernel written in C and NASM. Implements GDT, IDT, PIC, PIT, paging, a simple heap allocator, VGA text output, keyboard IRQ, and int 0x80 system calls. Boots and runs on QEMU.",
    tags: ["C", "NASM", "x86", "QEMU", "GDT", "IDT", "Paging"],
    github: "https://github.com/Mourya05/hobby-os",
  },
  {
    title: "Tab-Based GM Counting System",
    description:
      "A tablet-optimized radiation monitoring app built during my internship at Nucleonix Systems. Integrates Nordic UART Service (NUS) BLE communication with Arduino-based GM detectors, device-based access control via Supabase, on-device SQLite storage, and a Node.js/REST backend. [TODO: confirm exactly what I built vs the team]",
    tags: ["React Native", "BLE/NUS", "Arduino", "SQLite", "Supabase", "Node.js", "Expo"],
    github: "https://github.com/Mourya05/gm-counting-system",
  },
  {
    title: "Custom POSIX Shell",
    description:
      "A Unix-like shell written in C. Supports fork/exec process creation, pipes, I/O redirection, signal handling, background jobs, and built-in commands (cd, exit, history).",
    tags: ["C", "POSIX", "fork/exec", "Pipes", "Signals"],
    github: "https://github.com/Mourya05/custom-shell",
  },
];

const other: OtherProject[] = [
  {
    title: "NeuralMesh",
    blurb: "Prototype applying a graph attention network to Ethereum mempool transactions.",
    tags: ["Python", "PyTorch", "Graph Attention Network", "Ethereum"],
    github: "https://github.com/Mourya05/neuralmesh",
    note: "[TODO: dataset, precision/recall, latency measurement] — prototype status",
  },
  {
    title: "Probabilistic Character Recognition",
    blurb: "Bayesian inference applied to character classification, implemented in R.",
    tags: ["R", "Bayesian Inference", "Statistics"],
    github: "https://github.com/Mourya05/probabilistic-char-recognition",
  },
  {
    title: "Student Attendance System",
    blurb: "Automated attendance using OpenCV and face_recognition for facial encoding and matching.",
    tags: ["Python", "OpenCV", "face_recognition", "SQL"],
    github: "https://github.com/Mourya05/attendance-system",
  },
  {
    title: "Eat-IQ",
    blurb: "Nutrition tracking app with daily caloric, macro, and hydration dashboards.",
    tags: ["React", "Node.js", "SQLite"],
    github: "https://github.com/Mourya05/eat-iq",
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function FeaturedCard({ project }: { project: FeaturedProject }) {
  return (
    <article
      className="card reveal"
      style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <h3 style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text)", lineHeight: 1.3 }}>
        {project.title}
      </h3>

      <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, flexGrow: 1 }}>
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex items-center gap-2"
          style={{ fontSize: "13px", padding: "7px 16px" }}
          aria-label={`View ${project.title} on GitHub`}
        >
          <FaGithub size={14} />
          GitHub
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ fontSize: "13px", padding: "7px 16px" }}
            aria-label={`View live demo of ${project.title}`}
          >
            Demo
          </a>
        )}
      </div>
    </article>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────── */
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 60);
            });
          }
        });
      },
      { threshold: 0.04 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects-inner"
      ref={sectionRef}
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>Projects</p>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              lineHeight: 1.15,
            }}
          >
            Featured work
          </h2>
        </div>

        {/* Featured projects grid */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
            marginBottom: "72px",
          }}
        >
          {featured.map((p) => (
            <FeaturedCard key={p.title} project={p} />
          ))}
        </div>

        {/* Other work */}
        <div className="reveal">
          <h3
            className="mono"
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "20px",
            }}
          >
            Other work
          </h3>
          <div className="flex flex-col" style={{ gap: "0" }}>
            {other.map((p, idx) => (
              <div
                key={p.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "start",
                  gap: "16px",
                  padding: "16px 0",
                  borderTop: idx === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div className="flex flex-wrap items-baseline gap-3" style={{ marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>
                      {p.title}
                    </span>
                    {p.note && (
                      <span className="mono" style={{ fontSize: "10px", color: "var(--muted)" }}>
                        prototype
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "8px" }}>
                    {p.blurb}
                  </p>
                  {p.note && (
                    <p style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic", marginBottom: "8px" }}>
                      {p.note}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-accent"
                  style={{ color: "var(--muted)", marginTop: "2px" }}
                  aria-label={`View ${p.title} on GitHub`}
                >
                  <FaGithub size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
