"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaDownload } from "react-icons/fa6";

const staticKeywords = [
  "Machine Learning",
  "LLM Inference",
  "Computer Vision",
  "Full-Stack",
];

export default function HeroSection() {
  function scrollToProjects(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById("projects");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section
      id="home"
      className="relative flex flex-col justify-between overflow-hidden bg-[var(--bg)]"
      style={{
        minHeight: "calc(100svh - 64px)",
        paddingTop: "64px",
      }}
    >
      {/* 56px fine line-grid at ~3% opacity with radial mask fade */}
      <div
        aria-hidden="true"
        className="cyber-line-grid absolute inset-0 pointer-events-none"
      />

      {/* Diagonal violet light beam from top-right */}
      <div
        aria-hidden="true"
        className="cyber-beam absolute top-0 right-0 w-full h-[650px] pointer-events-none"
      />

      {/* Soft violet glow behind the portrait */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Main 2-column hero area */}
      <div className="section-wrap flex-1 flex items-center py-12 lg:py-16 relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Status, Headline, Copy, Buttons, Links */}
          <div className="flex flex-col items-start">
            
            {/* Status Line: Small violet square bullet + plain mono line */}
            <div className="hero-animate-1 flex items-center gap-2.5 mb-6">
              <span
                className="w-2 h-2 shrink-0 inline-block bg-[var(--accent)]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />
              <span className="mono text-xs text-[var(--muted)] tracking-wider">
                FINAL-YEAR B.TECH CSE · GCET, HYDERABAD · 2027
              </span>
            </div>

            {/* H1: Mourya (weight 300 in --text), Birru (weight 700 in lavender #c4b5fd) */}
            <h1
              className="hero-animate-2 tracking-tight mb-5"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 7rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
              }}
            >
              <span style={{ fontWeight: 300, color: "var(--text)" }}>Mourya </span>
              <span style={{ fontWeight: 700, color: "#c4b5fd" }}>Birru</span>
            </h1>

            {/* Subtitle */}
            <p
              className="hero-animate-3 text-lg sm:text-xl lg:text-2xl font-medium mb-2 text-white"
              style={{
                lineHeight: 1.35,
                maxWidth: "600px",
              }}
            >
              Final-year CS student building machine learning and software that works end to end.
            </p>

            {/* Direct addition under sub copy */}
            <p className="hero-animate-3 text-sm text-[var(--muted)] mb-4 font-normal">
              Open to AI/ML, data science and SDE roles.
            </p>

            {/* Support Line */}
            <p
              className="hero-animate-4 text-sm sm:text-base mb-8 text-[var(--muted)]"
              style={{
                lineHeight: 1.6,
                maxWidth: "540px",
              }}
            >
              From a CUDA inference engine for LLMs to a BLE-connected radiation monitoring app. I like knowing how things work underneath.
            </p>

            {/* Chamfered Buttons */}
            <div className="hero-animate-4 flex flex-wrap items-center gap-4 mb-8">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="btn-primary"
              >
                <span>View projects</span>
                <FaArrowRight size={12} />
              </a>
              <a
                href="/Mourya_Resume.pdf"
                download="Mourya_Birru_Resume.pdf"
                className="btn-secondary"
              >
                <span className="btn-secondary-inner">
                  <FaDownload size={12} />
                  <span>Resume</span>
                </span>
              </a>
            </div>

            {/* Text Links */}
            <div className="hero-animate-4 flex items-center gap-6 mono text-xs">
              <a
                href="https://github.com/mourya05"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors text-[var(--muted)] hover:text-[var(--accent)]"
                style={{ textDecoration: "none" }}
              >
                <FaGithub size={13} />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/mourya-birru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors text-[var(--muted)] hover:text-[var(--accent)]"
                style={{ textDecoration: "none" }}
              >
                <FaLinkedin size={13} />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:mourya.birru@gmail.com"
                className="inline-flex items-center gap-1.5 transition-colors text-[var(--muted)] hover:text-[var(--accent)]"
                style={{ textDecoration: "none" }}
              >
                <FaEnvelope size={13} />
                <span>Email</span>
              </a>
            </div>

          </div>

          {/* Right Column: Chamfered Duotone Portrait Card */}
          <div className="hero-animate-right flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[350px]">
              
              {/* Secondary outline frame offset 12px behind for depth */}
              <div
                aria-hidden="true"
                className="absolute inset-0 chamfer-28 pointer-events-none hidden sm:block"
                style={{
                  transform: "translate(12px, 12px)",
                  background: "var(--border-strong)",
                  padding: "1px",
                }}
              >
                <div
                  className="w-full h-full chamfer-27"
                  style={{ background: "transparent" }}
                />
              </div>

              {/* Foreground Chamfered Frame (28px cuts) with 1px border */}
              <div
                className="relative aspect-[4/5] chamfer-28"
                style={{
                  background: "var(--border-strong)",
                  padding: "1px",
                }}
              >
                <div
                  className="relative w-full h-full chamfer-27 overflow-hidden"
                  style={{
                    backgroundColor: "var(--surface)",
                  }}
                >
                  {/* Photo in full natural color */}
                  <Image
                    src="/myphoto.jpeg"
                    alt="Mourya Birru — CS Student at GCET"
                    fill
                    priority
                    sizes="(max-width: 768px) 320px, 350px"
                    className="object-cover"
                  />

                  {/* Bottom gradient into --bg */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, var(--bg) 0%, rgba(7, 6, 12, 0.4) 35%, transparent 70%)",
                    }}
                  />

                  {/* Caption in mono at the bottom-left: "CLASS OF 2027 · GCET" */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="mono text-[11px] font-medium tracking-wider text-[var(--text)]">
                      CLASS OF 2027 · GCET
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 4.4 Static Strip: One hairline-bordered row, mono muted text, "/" separators */}
      <div
        className="w-full border-t border-b border-[var(--border)] py-3 relative z-10"
        style={{
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="section-wrap flex flex-wrap items-center justify-between gap-4 mono text-xs text-[var(--muted)] tracking-wider">
          {staticKeywords.map((kw, i) => (
            <div key={kw} className="flex items-center gap-4 sm:gap-6">
              <span>{kw}</span>
              {i < staticKeywords.length - 1 && (
                <span className="text-[var(--border-strong)]">/</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
