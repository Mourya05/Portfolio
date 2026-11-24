"use client";

import Image from "next/image";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaDownload, FaCode } from "react-icons/fa6";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function HeroSection() {
  function scrollToProjects(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById("projects");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function openPalette() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  }

  return (
    <section
      id="home"
      className="relative flex flex-col overflow-hidden"
      style={{
        minHeight: "calc(100vh - 56px)",
        marginTop: 56,
        paddingTop: "clamp(32px, 5vh, 60px)",
        background: "transparent",
      }}
    >
      {/* Very subtle grid in hero background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 80%)",
        }}
      />

      {/* Two-column layout */}
      <div className="section-wrap flex-1 flex items-center relative z-10">
        <div
          className="w-full grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center"
          style={{ paddingBottom: "clamp(24px, 4vh, 48px)" }}
        >

          {/* ── LEFT: Text Mount Choreography ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >

            {/* Status line with live radar-ping pulse */}
            <motion.div variants={itemVariants} className="mb-6 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-[#F59E0B]"
                  animate={{ scale: [1, 2.5, 2.5], opacity: [0.75, 0, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase" }}
              >
                HYD, IN ·{" "}
                <span style={{ color: "var(--amber)", fontWeight: 500 }}>
                  OPEN TO AI/ML, DATA SCIENCE & SDE ROLES
                </span>
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={itemVariants}
              className="tracking-tight mb-4"
              style={{
                fontSize: "clamp(3.6rem, 8.5vw, 7.8rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.96,
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Mourya<br />
              <span style={{ color: "var(--muted)", fontWeight: 300 }}>Birru</span>
            </motion.h1>

            {/* Positioning copy */}
            <motion.p
              variants={itemVariants}
              className="mb-8"
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
                lineHeight: 1.6,
                maxWidth: 520,
                color: "var(--muted)",
              }}
            >
              From a CUDA inference engine for LLMs to a BLE-connected radiation monitoring app.
              I like knowing how things work underneath.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 mb-6">
              <motion.a
                whileTap={{ scale: 0.97 }}
                href="#projects"
                onClick={scrollToProjects}
                className="btn-primary group"
              >
                <span>View Projects</span>
                <FaArrowRight
                  size={11}
                  className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                />
              </motion.a>

              <motion.a
                whileTap={{ scale: 0.97 }}
                href="/Mourya_Resume.pdf"
                download="Mourya_Birru_Resume.pdf"
                className="btn-ghost"
              >
                <FaDownload size={11} />
                <span>Resume</span>
              </motion.a>

              <button
                onClick={openPalette}
                className="mono transition-colors hover:text-white"
                style={{
                  fontSize: 11,
                  color: "var(--subtle)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                  padding: "2px 0",
                }}
                aria-label="Open command palette"
              >
                Press ⌘K to navigate
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex items-center gap-6 mono" style={{ fontSize: 12 }}>
              {[
                { href: "https://github.com/mourya05", icon: <FaGithub size={13} />, label: "GitHub" },
                { href: "https://linkedin.com/in/mourya-birru", icon: <FaLinkedin size={13} />, label: "LinkedIn" },
                { href: "mailto:mourya.birru@gmail.com", icon: <FaEnvelope size={13} />, label: "Email" },
                { href: "https://leetcode.com/u/mourya_birru/", icon: <FaCode size={13} />, label: "LeetCode" },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors"
                  style={{
                    textDecoration: "none",
                    color: "var(--muted)",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Portrait Frame with Monochrome-to-Color & Expanding Ticks ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            {/* Framed portrait container with 4 expanding corner registration ticks on hover */}
            <div
              className="relative group border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors duration-200 hover:border-amber-500/50"
              style={{
                width: "min(320px, 80vw)",
                aspectRatio: "4 / 5",
              }}
            >
              {/* 4 Corner Crosshairs: Expanding 3px outward & shifting to amber on hover */}
              <span
                aria-hidden="true"
                className="absolute w-2 h-2 pointer-events-none -top-1 -left-1 border-t-2 border-l-2 border-amber-500/60 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[3px] group-hover:-translate-y-[3px] group-hover:border-amber-400 group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute w-2 h-2 pointer-events-none -top-1 -right-1 border-t-2 border-r-2 border-amber-500/60 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:border-amber-400 group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute w-2 h-2 pointer-events-none -bottom-1 -left-1 border-b-2 border-l-2 border-amber-500/60 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[3px] group-hover:translate-y-[3px] group-hover:border-amber-400 group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute w-2 h-2 pointer-events-none -bottom-1 -right-1 border-b-2 border-r-2 border-amber-500/60 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:border-amber-400 group-hover:scale-110"
              />

              {/* Index tag top-left */}
              <div
                className="mono absolute z-20 transition-colors duration-200 group-hover:text-amber-400"
                style={{
                  top: 10,
                  left: 10,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: "var(--amber)",
                  textTransform: "uppercase",
                  opacity: 0.85,
                }}
                aria-hidden="true"
              >
                FIG_01 · CLASS_OF_2027
              </div>

              {/* Photo: smooth monochrome-to-color transition on hover (duration-300) */}
              <Image
                src="/myphoto.jpeg"
                alt="Mourya Birru — CS Student at GCET, Hyderabad"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 320px"
                className="object-cover object-top grayscale brightness-90 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:brightness-100"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, #000 55%, transparent 100%), " +
                    "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                  maskComposite: "intersect",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, #000 55%, transparent 100%), " +
                    "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                  WebkitMaskComposite: "source-in",
                }}
              />

              {/* Dark overlay for contrast */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-75"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(7,8,10,0.1) 0%, rgba(7,8,10,0.6) 80%, var(--bg) 100%)",
                }}
              />

              {/* GCET label */}
              <div
                className="absolute z-20 mono"
                style={{ bottom: 14, left: 14, fontSize: 9, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase" }}
              >
                GCET · B.TECH CSE
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
