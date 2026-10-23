"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function HeroSection() {
  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section
      id="hero-inner"
      className="flex items-center"
      style={{
        minHeight: "calc(100vh - 60px)",
        paddingTop: "60px",
      }}
    >
      <div className="section-wrap w-full">
        <div style={{ maxWidth: "680px", paddingTop: "64px", paddingBottom: "96px" }}>
          {/* Label */}
          <p className="section-label reveal visible" style={{ marginBottom: "20px" }}>
            Final-year B.Tech CSE · GCET, Hyderabad · 2027
          </p>

          {/* Name */}
          <h1
            className="reveal visible"
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginBottom: "16px",
            }}
          >
            Mourya Birru
          </h1>

          {/* One-line identity */}
          <p
            className="reveal visible"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "var(--muted)",
              lineHeight: 1.5,
              marginBottom: "24px",
              maxWidth: "56ch",
            }}
          >
            Final-year CS student building low-level systems and hardware-connected software.
          </p>

          {/* What I&apos;m looking for */}
          <p
            className="reveal visible"
            style={{
              fontSize: "15px",
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "52ch",
            }}
          >
            Open to SDE, systems, and embedded internships and entry-level roles.
          </p>

          {/* CTA buttons */}
          <div
            className="reveal visible flex flex-col sm:flex-row gap-3"
            style={{ marginBottom: "40px" }}
          >
            <button
              onClick={() => scrollTo("projects")}
              className="btn-primary"
              style={{ minHeight: "44px" }}
              aria-label="View my projects"
            >
              View projects
            </button>
            <a
              href="/Mourya_Resume.pdf"
              download="Mourya_Resume.pdf"
              className="btn-outline"
              style={{ minHeight: "44px" }}
              aria-label="Download resume PDF"
            >
              Resume
            </a>
          </div>

          {/* Social links */}
          <div className="reveal visible flex items-center gap-6">
            <a
              href="https://github.com/Mourya05"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover-accent transition-colors mono text-xs"
              style={{ color: "var(--muted)", textDecoration: "none" }}
              aria-label="GitHub profile"
            >
              <FaGithub size={16} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/mourya-birru-8336342a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover-accent transition-colors mono text-xs"
              style={{ color: "var(--muted)", textDecoration: "none" }}
              aria-label="LinkedIn profile"
            >
              <FaLinkedin size={16} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
