"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaDownload } from "react-icons/fa6";

const staticKeywords = [
  "Machine Learning",
  "LLM Inference",
  "Computer Vision",
  "Full-Stack",
];

const tickerItems = Array.from({ length: 6 }, () => staticKeywords).flat();

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
      className="relative flex flex-col justify-between overflow-hidden"
      style={{
        minHeight: "calc(100svh - 64px)",
        paddingTop: "64px",
        background: "transparent",
      }}
    >
      {/* Fine line-grid overlay — subtle, masked */}
      <div
        aria-hidden="true"
        className="cyber-line-grid absolute inset-0 pointer-events-none"
      />

      {/* Diagonal violet beam */}
      <div
        aria-hidden="true"
        className="cyber-beam absolute top-0 right-0 w-full h-[700px] pointer-events-none"
      />

      {/* Portrait glow disc — large, centred behind the portrait */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          right: "6%",
          width: "min(600px, 48vw)",
          height: "min(600px, 48vw)",
          transform: "translateY(-50%)",
          background:
            "radial-gradient(circle, rgba(244,63,94,.26) 0%, rgba(139,92,246,.28) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Main 2-column area */}
      <div className="section-wrap flex-1 flex items-center py-14 lg:py-20 relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center">

          {/* ── Left: text ── */}
          <div className="flex flex-col items-start">

            {/* Status Badge — one alive element */}
            <div className="hero-animate-1 mb-7">
              <div className="status-badge">
                <span className="status-dot-wrap" aria-hidden="true">
                  <span className="status-dot-ping" />
                  <span className="status-dot" />
                </span>
                <span
                  className="mono tracking-wider"
                  style={{ fontSize: "14px", color: "#fb7185" }}
                >
                  Open to AI/ML, DS &amp; SDE roles
                </span>
              </div>
            </div>

            {/* H1 — big */}
            <h1
              className="hero-animate-2 tracking-tight mb-5"
              style={{
                fontSize: "clamp(4rem, 9vw, 8.5rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1.0,
                fontWeight: 300,
              }}
            >
              <span style={{ color: "var(--text)" }}>Mourya </span>
              <span className="grad-text" style={{ fontWeight: 700 }}>Birru</span>
            </h1>

            {/* Subtitle */}
            <p
              className="hero-animate-3 font-medium mb-2"
              style={{
                fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)",
                lineHeight: 1.35,
                maxWidth: "580px",
                color: "var(--text)",
              }}
            >
              Final-year CS student building machine learning and software that works end to end.
            </p>

            {/* Sub-copy */}
            <p
              className="hero-animate-3 mb-4"
              style={{ fontSize: "15px", color: "var(--muted)" }}
            >
              Open to AI/ML, data science and SDE roles.
            </p>

            {/* Support paragraph */}
            <p
              className="hero-animate-4 mb-10"
              style={{
                fontSize: "17px",
                lineHeight: 1.65,
                maxWidth: "520px",
                color: "var(--muted)",
              }}
            >
              From a CUDA inference engine for LLMs to a BLE-connected radiation monitoring app. I like knowing how things work underneath.
            </p>

            {/* CTAs */}
            <div className="hero-animate-4 flex flex-wrap items-center gap-4 mb-9">
              <a href="#projects" onClick={scrollToProjects} className="btn-primary">
                <span>View projects</span>
                <FaArrowRight size={13} />
              </a>
              <a href="/Mourya_Resume.pdf" download="Mourya_Birru_Resume.pdf" className="btn-secondary">
                <span className="btn-secondary-inner">
                  <FaDownload size={13} />
                  <span>Resume</span>
                </span>
              </a>
            </div>

            {/* Social links */}
            <div className="hero-animate-4 flex items-center gap-7 mono" style={{ fontSize: "13px" }}>
              <a
                href="https://github.com/mourya05"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors"
                style={{ textDecoration: "none", color: "var(--muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--violet-hi)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
              >
                <FaGithub size={14} />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/mourya-birru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors"
                style={{ textDecoration: "none", color: "var(--muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--violet-hi)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
              >
                <FaLinkedin size={14} />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:mourya.birru@gmail.com"
                className="inline-flex items-center gap-1.5 transition-colors"
                style={{ textDecoration: "none", color: "var(--muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--violet-hi)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
              >
                <FaEnvelope size={14} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* ── Right: portrait — no frame, mask fade ── */}
          <div className="hero-animate-right flex justify-center lg:justify-end">
            {/*
              Container is ~40% of hero width on desktop.
              The image itself fades out at the bottom and edges via mask-image.
              A violet-tinted gradient overlay sits on top with mix-blend-mode to
              kill the harsh white background in the photo.
            */}
            <div
              className="relative"
              style={{
                width: "min(360px, 42vw)",
                /* height auto from aspect-ratio */
                aspectRatio: "4/5",
                flexShrink: 0,
              }}
            >
              {/* Photo */}
              <Image
                src="/myphoto.jpeg"
                alt="Mourya Birru — CS Student at GCET"
                fill
                priority
                sizes="(max-width: 768px) 340px, 360px"
                className="object-cover object-top"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, #000 60%, transparent 100%), " +
                    "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
                  maskComposite: "intersect",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, #000 60%, transparent 100%), " +
                    "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
                  WebkitMaskComposite: "source-in",
                }}
              />

              {/* Violet-to-black overlay — kills harsh white bg */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, rgba(13,11,20,0.72) 75%, var(--void) 100%)",
                  mixBlendMode: "multiply",
                }}
              />

              {/* Caption in the lower area */}
              <div
                className="absolute z-20"
                style={{ bottom: "18%", left: 0 }}
              >
                <span
                  className="mono tracking-wider"
                  style={{ fontSize: "11px", color: "var(--violet-hi)", opacity: 0.8 }}
                >
                  CLASS OF 2027 · GCET
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Capability strip marquee (moving left to right) */}
      <div
        className="w-full border-t border-b py-3.5 relative z-10 overflow-hidden ticker-mask select-none"
        style={{
          backgroundColor: "rgba(13,11,20,0.6)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--border)",
        }}
        aria-label="Core Technical Capabilities"
      >
        <div
          className="ticker-track-right flex items-center mono tracking-widest text-[12px]"
          style={{ letterSpacing: "0.14em", color: "var(--violet-hi)" }}
        >
          {/* Set 1 */}
          <div className="flex items-center shrink-0">
            {tickerItems.map((kw, i) => (
              <div key={`track-a-${i}`} className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8">
                <span className="whitespace-nowrap transition-colors hover:text-white cursor-default">
                  {kw}
                </span>
                <span style={{ color: "var(--border-strong)", opacity: 0.8 }}>/</span>
              </div>
            ))}
          </div>

          {/* Set 2 (Identical duplicate for seamless continuous flow) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {tickerItems.map((kw, i) => (
              <div key={`track-b-${i}`} className="flex items-center gap-6 sm:gap-8 pr-6 sm:pr-8">
                <span className="whitespace-nowrap transition-colors hover:text-white cursor-default">
                  {kw}
                </span>
                <span style={{ color: "var(--border-strong)", opacity: 0.8 }}>/</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
