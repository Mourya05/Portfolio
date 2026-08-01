"use client";

import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Domain = "networking" | "cloud-db" | "ai-data" | "analytics" | "web-dev" | "badges";

interface Cert {
  id: string;
  title: string;
  issuer: string;
  domain: Domain;
  icon: string;
  accentColor: string;
  accentRgb: string;
  year?: string;
  image?: string;
}

// ─── Domain Config ─────────────────────────────────────────────────────────────
const DOMAIN_CONFIG: Record<
  Domain,
  { label: string; shortLabel: string; color: string; colorRgb: string; slotColor: string }
> = {
  networking: { label: "CORE NETWORKING",    shortLabel: "NETWORK",   color: "#00E5FF", colorRgb: "0,229,255",   slotColor: "#00E5FF" },
  "cloud-db":  { label: "CLOUD & DEV",        shortLabel: "CLOUD",     color: "#A18AFF", colorRgb: "161,138,255", slotColor: "#A18AFF" },
  "ai-data":   { label: "AI & DATA SCIENCE",  shortLabel: "AI/DATA",   color: "#FF6B6B", colorRgb: "255,107,107", slotColor: "#FF6B6B" },
  analytics:   { label: "ANALYTICS",          shortLabel: "ANALYTICS", color: "#F2C811", colorRgb: "242,200,17",  slotColor: "#F2C811" },
  "web-dev":   { label: "WEB & PROGRAMMING",  shortLabel: "WEB/PROG",  color: "#39FF14", colorRgb: "57,255,20",   slotColor: "#39FF14" },
  badges:      { label: "VERIFIED BADGES",    shortLabel: "BADGES",    color: "#FFA116", colorRgb: "255,161,22",  slotColor: "#FFA116" },
};

// ─── Certificate Data ──────────────────────────────────────────────────────────
const CERTS: Cert[] = [
  // Networking
  { id: "c01", title: "Network Technician",             issuer: "Cisco",                   domain: "networking", icon: "🌐", accentColor: "#00E5FF", accentRgb: "0,229,255",   year: "Oct 2025", image: "/certificates/Network_Technician_Career_Path_certificate.jpg" },
  { id: "c02", title: "CCNA: Introduction to Networks", issuer: "Cisco Networking Academy", domain: "networking", icon: "📡", accentColor: "#00E5FF", accentRgb: "0,229,255",   year: "Oct 2025", image: "/certificates/CCNA-_Introduction_to_Networks_certificate.jpg" },
  // Cloud / DB / Dev
  { id: "c03", title: "Certified Developer, Associate (C100DEV)", issuer: "MongoDB",    domain: "cloud-db",  icon: "🍃", accentColor: "#A18AFF", accentRgb: "161,138,255", year: "Jul 2025", image: "/certificates/MongoDB Certificate_page-0001.jpg" },
  { id: "c04", title: "Software Engineer Skills",       issuer: "Electronic Arts (EA)",    domain: "cloud-db",  icon: "🎮", accentColor: "#A18AFF", accentRgb: "161,138,255", year: "Jan 2025", image: "/certificates/Software Engineering Skills.jpg" },
  // AI & Data Science
  { id: "c05", title: "80 Days of GenAI Mastery",       issuer: "Udemy",                   domain: "ai-data",   icon: "🤖", accentColor: "#FF6B6B", accentRgb: "255,107,107", year: "May 2025", image: "/certificates/80 Days of Gen AI Mastery.jpg" },
  { id: "c06", title: "Data Science & ML Bootcamp with R", issuer: "Udemy",               domain: "ai-data",   icon: "📊", accentColor: "#FF6B6B", accentRgb: "255,107,107", year: "Apr 2025", image: "/certificates/R.jpg" },
  { id: "c07", title: "Machine Learning in Python",     issuer: "365 Data Science",        domain: "ai-data",   icon: "🧠", accentColor: "#FF6B6B", accentRgb: "255,107,107", year: "Nov 2024", image: "/certificates/CC-AC98253341_page-0001.jpg" },
  { id: "c08", title: "Generative AI",                  issuer: "Microsoft",               domain: "ai-data",   icon: "✨", accentColor: "#FF6B6B", accentRgb: "255,107,107", year: "Aug 2024", image: "/certificates/Build Your Generative AI Productivity Skills with Microsoft and LinkedIn.jpg" },
  { id: "c09", title: "Intro to Generative AI Studio",  issuer: "Google Cloud",            domain: "ai-data",   icon: "☁️", accentColor: "#FF6B6B", accentRgb: "255,107,107", year: "Jul 2024", image: "/certificates/Introduction to Generative AI Studio.png" },
  { id: "c10", title: "ADK Crash Course",               issuer: "Google",                  domain: "ai-data",   icon: "🤖", accentColor: "#FF6B6B", accentRgb: "255,107,107", year: "Jun 2026" },
  // Analytics
  { id: "c11", title: "Data Visualization",             issuer: "Tata Group",              domain: "analytics", icon: "📈", accentColor: "#F2C811", accentRgb: "242,200,17",  year: "Nov 2024", image: "/certificates/Tata forage_page-0001.jpg" },
  { id: "c12", title: "Data Analytics and Visualization", issuer: "Accenture",             domain: "analytics", icon: "🔍", accentColor: "#F2C811", accentRgb: "242,200,17",  year: "Sep 2024", image: "/certificates/Accenture Data Analysis.jpg" },
  { id: "c13", title: "Power BI",                       issuer: "Simplilearn",             domain: "analytics", icon: "⚡", accentColor: "#F2C811", accentRgb: "242,200,17",  year: "Jul 2024", image: "/certificates/PowerBI.jfif" },
  // Web Dev
  { id: "c14", title: "Complete Full-Stack Web Dev Bootcamp", issuer: "Udemy",            domain: "web-dev",   icon: "💻", accentColor: "#39FF14", accentRgb: "57,255,20",   year: "Apr 2025", image: "/certificates/Web Development BootCamp.jpg" },
  { id: "c15", title: "Advanced Programming in C",      issuer: "Cisco Networking Academy", domain: "web-dev", icon: "⚙️", accentColor: "#39FF14", accentRgb: "57,255,20",   year: "Jun 2024", image: "/certificates/Advanced Programming in C.jpg" },
  { id: "c16", title: "Introduction to Python",         issuer: "Infosys Springboard",     domain: "web-dev",   icon: "🐍", accentColor: "#39FF14", accentRgb: "57,255,20",   year: "Nov 2024", image: "/certificates/Introduction to Python.jpg" },
  // Badges
  { id: "c17", title: "Top Interview 150 Badge",        issuer: "LeetCode",                domain: "badges",    icon: "🏆", accentColor: "#FFA116", accentRgb: "255,161,22",  year: "Apr 2025" },
  { id: "c18", title: "LeetCode 75",                    issuer: "LeetCode",                domain: "badges",    icon: "🎯", accentColor: "#FFA116", accentRgb: "255,161,22",  year: "Apr 2025" },
  { id: "c19", title: "SQL",                            issuer: "HackerRank",              domain: "badges",    icon: "🗄️", accentColor: "#FFA116", accentRgb: "255,161,22",  year: "Nov 2024", image: "/certificates/SQL HackerRank.jpg" },
  { id: "c20", title: "Problem Solving",                issuer: "HackerRank",              domain: "badges",    icon: "🧩", accentColor: "#FFA116", accentRgb: "255,161,22",  year: "Aug 2024", image: "/certificates/Problem Solving HackerRank.png" },
  { id: "c21", title: "Java",                           issuer: "HackerRank",              domain: "badges",    icon: "☕", accentColor: "#FFA116", accentRgb: "255,161,22",  year: "Oct 2024", image: "/certificates/Java HackerRank.png" },
  { id: "c22", title: "Python",                         issuer: "HackerRank",              domain: "badges",    icon: "🐍", accentColor: "#FFA116", accentRgb: "255,161,22",  year: "Aug 2024", image: "/certificates/Python HackerRank.png" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DOMAINS = Object.keys(DOMAIN_CONFIG) as Domain[];

// ─── Empty Slot Glow ──────────────────────────────────────────────────────────
function EmptySlot({ color }: { color: string }) {
  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{ height: 88, position: "relative", background: "rgba(0,0,0,0.4)" }}
    >
      {/* Inner void */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,160,0,0.07) 0%, transparent 70%)`,
          border: "1px dashed rgba(255,160,0,0.18)",
        }}
      />
      {/* Amber LED warning row */}
      <div className="absolute bottom-2 inset-x-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#FFA500" }}
            animate={{ opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
        <span
          className="font-mono text-[7px] tracking-[0.25em] uppercase ml-1"
          style={{ color: "rgba(255,160,0,0.45)" }}
        >
          SLOT ACTIVE — HARDWARE DISRUPTION
        </span>
      </div>
      {/* Slot ID label */}
      <div className="absolute top-2 right-3">
        <span className="font-mono text-[7px] text-white/10">
          [{color.slice(1)}]
        </span>
      </div>
    </div>
  );
}

// ─── Cryptographic Cartridge ──────────────────────────────────────────────────
function Cartridge({
  cert,
  isEjected,
  onHover,
  onLeave,
  onClick,
}: {
  cert: Cert;
  isEjected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const hasImage = Boolean(cert.image);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => { setHovered(true); onHover(); };
  const handleMouseLeave = () => { setHovered(false); onLeave(); };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        z: isEjected ? 60 : 0,
        x: isEjected ? -12 : 0,
        scale: isEjected ? 1.04 : 1,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 800,
        cursor: hasImage ? "pointer" : "default",
        position: "relative",
        zIndex: isEjected ? 20 : 1,
      }}
    >
      {/* ── Glass Acrylic Block ── */}
      <div
        style={{
          height: 88,
          borderRadius: 10,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg,
            rgba(${cert.accentRgb},0.13) 0%,
            rgba(12,12,24,0.88) 40%,
            rgba(${cert.accentRgb},0.06) 100%)`,
          border: `1px solid rgba(${cert.accentRgb},${isEjected ? 0.55 : 0.22})`,
          boxShadow: isEjected
            ? `0 0 0 1px rgba(${cert.accentRgb},0.3),
               0 0 40px rgba(${cert.accentRgb},0.32),
               0 16px 48px rgba(0,0,0,0.8),
               inset 0 1px 0 rgba(255,255,255,0.07)`
            : `0 4px 20px rgba(0,0,0,0.6),
               inset 0 1px 0 rgba(255,255,255,0.04)`,
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          transition: "border-color 0.2s, box-shadow 0.3s",
        }}
      >
        {/* Glass refraction shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Accent edge strip (left rail) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(to bottom, rgba(${cert.accentRgb},0.8), rgba(${cert.accentRgb},0.2))`,
            borderRadius: "10px 0 0 10px",
          }}
        />

        {/* Holographic issuer watermark */}
        <div
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            opacity: isEjected ? 0.22 : 0.08,
            filter: "grayscale(1) brightness(1.4)",
            transition: "opacity 0.3s",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {cert.icon}
        </div>

        {/* Scanline texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
            pointerEvents: "none",
          }}
        />

        {/* Cartridge label */}
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {/* Issuer badge */}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "7px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: cert.accentColor,
              background: `rgba(${cert.accentRgb},0.12)`,
              border: `1px solid rgba(${cert.accentRgb},0.28)`,
              padding: "1px 6px",
              borderRadius: 3,
              display: "inline-block",
              width: "fit-content",
            }}
          >
            {cert.issuer}
          </span>
          {/* Title */}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: "11px",
              color: isEjected ? "#fff" : "rgba(255,255,255,0.8)",
              lineHeight: 1.3,
              maxWidth: 180,
              transition: "color 0.2s",
            }}
          >
            {cert.title}
          </span>
          {/* Year / slot ID */}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "7px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {cert.year} · {cert.id.toUpperCase()}
          </span>
        </div>

        {/* View hint */}
        {hasImage && isEjected && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              position: "absolute",
              right: 12,
              bottom: 10,
              fontFamily: "monospace",
              fontSize: "8px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: cert.accentColor,
            }}
          >
            CLICK TO OPEN ↗
          </motion.div>
        )}

        {/* Top gloss edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 3,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, rgba(${cert.accentRgb},0.4) 0%, transparent 60%)`,
            borderRadius: "0 10px 0 0",
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Laser Verify Modal ────────────────────────────────────────────────────────
function VaultModal({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const [verified, setVerified] = useState(false);
  const [sweepDone, setSweepDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSweepDone(true), 1200);
    const t2 = setTimeout(() => setVerified(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      key="vault-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "rgba(0,0,2,0.93)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      onClick={onClose}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.015) 2px, rgba(0,229,255,0.015) 4px)",
        }}
      />

      <motion.div
        key="vault-frame"
        initial={{ opacity: 0, scale: 0.88, rotateX: 8 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: -6 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(90vw, 860px)",
          background: "rgba(3,3,12,0.97)",
          border: `1px solid rgba(${cert.accentRgb},0.45)`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: `0 0 0 1px rgba(${cert.accentRgb},0.2),
            0 0 80px rgba(${cert.accentRgb},0.18),
            0 60px 120px rgba(0,0,0,0.9)`,
          position: "relative",
        }}
      >
        {/* ── Laser Sweep Overlay ── */}
        <AnimatePresence>
          {!sweepDone && (
            <motion.div
              key="laser"
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "linear" }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent, rgba(${cert.accentRgb},1) 40%, transparent)`,
                boxShadow: `0 0 20px rgba(${cert.accentRgb},0.9), 0 0 60px rgba(${cert.accentRgb},0.4)`,
                zIndex: 30,
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Top accent beam ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${cert.accentColor}, transparent)`,
            opacity: 0.8,
          }}
        />

        {/* ── Header Bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid rgba(${cert.accentRgb},0.15)`,
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Status LED */}
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: verified ? "#39FF14" : cert.accentColor,
                boxShadow: `0 0 10px ${verified ? "#39FF14" : cert.accentColor}`,
                transition: "background 0.4s",
              }}
            />
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: cert.accentColor, marginBottom: 2 }}>
                {cert.issuer} · CREDENTIAL_VAULT
              </p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>
                {cert.title}
              </p>
            </div>
          </div>

          {/* Verify Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.span
              key={verified ? "verified" : "verifying"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: verified ? "#39FF14" : cert.accentColor,
                padding: "3px 8px",
                border: `1px solid ${verified ? "#39FF14" : cert.accentColor}50`,
                borderRadius: 4,
                background: verified ? "rgba(57,255,20,0.08)" : `rgba(${cert.accentRgb},0.08)`,
              }}
            >
              {verified ? "✓ SIGNATURE VERIFIED" : "[ VERIFYING CRYPTOGRAPHIC SIGNATURE... ]"}
            </motion.span>

            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Certificate Viewport ── */}
        <div
          style={{
            minHeight: 400,
            maxHeight: "65vh",
            overflowY: "auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "rgba(0,0,0,0.5)",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at center, rgba(${cert.accentRgb},0.07) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {cert.image ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: `0 0 60px rgba(${cert.accentRgb},0.2), 0 30px 80px rgba(0,0,0,0.8)`,
              }}
            >
              {/* Projected laser lines above cert */}
              {!sweepDone && (
                <motion.div
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.6, repeat: 3 }}
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, rgba(${cert.accentRgb},0.9), transparent)`,
                    zIndex: 10,
                    boxShadow: `0 0 12px rgba(${cert.accentRgb},0.8)`,
                  }}
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.image}
                alt={`${cert.title} certificate`}
                style={{ maxHeight: "55vh", maxWidth: "100%", display: "block", objectFit: "contain" }}
                loading="eager"
              />
            </motion.div>
          ) : (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: "4rem", marginBottom: 16, filter: `drop-shadow(0 0 20px ${cert.accentColor})` }}>
                {cert.icon}
              </div>
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: cert.accentColor, marginBottom: 8 }}>
                DIGITAL CREDENTIAL
              </p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                Certificate image not uploaded yet.
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 20px",
            borderTop: `1px solid rgba(${cert.accentRgb},0.12)`,
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {cert.year && (
              <span style={{
                fontFamily: "monospace", fontSize: 8, letterSpacing: "0.25em",
                textTransform: "uppercase", color: cert.accentColor,
                background: `rgba(${cert.accentRgb},0.1)`,
                border: `1px solid rgba(${cert.accentRgb},0.22)`,
                padding: "2px 8px", borderRadius: 3,
              }}>
                ISSUED · {cert.year}
              </span>
            )}
            <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.18)", letterSpacing: "0.25em" }}>
              ESC TO CLOSE
            </span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: "0.2em" }}>
            CREDENTIAL_VAULT · {cert.id.toUpperCase()}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Server Rack Domain Bay ────────────────────────────────────────────────────
function DomainBay({
  domain,
  certs,
  ejectedId,
  onEject,
  onLeave,
  onOpen,
}: {
  domain: Domain;
  certs: Cert[];
  ejectedId: string | null;
  onEject: (id: string) => void;
  onLeave: () => void;
  onOpen: (cert: Cert) => void;
}) {
  const cfg = DOMAIN_CONFIG[domain];

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        background: "rgba(4,4,12,0.7)",
        border: `1px solid rgba(${cfg.colorRgb},0.18)`,
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(${cfg.colorRgb},0.07)`,
        perspective: "800px",
      }}
    >
      {/* Bay Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderBottom: `1px solid rgba(${cfg.colorRgb},0.14)`,
          background: `linear-gradient(90deg, rgba(${cfg.colorRgb},0.08) 0%, rgba(0,0,0,0.3) 100%)`,
        }}
      >
        {/* LED */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, boxShadow: `0 0 8px ${cfg.color}`, flexShrink: 0 }}
        />
        <span style={{
          fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.3em",
          textTransform: "uppercase", color: cfg.color, flex: 1,
        }}>
          {cfg.label}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}>
          {String(certs.length).padStart(2, "0")} SLOTS
        </span>
      </div>

      {/* Rack Channel — screw bolts & rail */}
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 40,
          bottom: 8,
          width: 4,
          background: `linear-gradient(to bottom, rgba(${cfg.colorRgb},0.3), rgba(${cfg.colorRgb},0.05))`,
          borderRadius: 2,
          pointerEvents: "none",
        }}
      />

      {/* Cartridge Slots */}
      <div style={{ padding: "10px 10px 10px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
        {certs.map((cert) => {
          const isEjected = ejectedId === cert.id;
          return (
            <div key={cert.id} style={{ position: "relative" }}>
              {/* Empty slot (shown when ejected) */}
              {isEjected && <EmptySlot color={cfg.color} />}

              {/* Cartridge sits on top and slides out */}
              <div style={{ position: isEjected ? "absolute" : "relative", top: 0, left: 0, right: 0 }}>
                <Cartridge
                  cert={cert}
                  isEjected={isEjected}
                  onHover={() => onEject(cert.id)}
                  onLeave={onLeave}
                  onClick={() => cert.image && onOpen(cert)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CertificationsSection() {
  const [ejectedId, setEjectedId] = useState<string | null>(null);
  const [openCert, setOpenCert] = useState<Cert | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEject = useCallback((id: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setEjectedId(id);
  }, []);

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setEjectedId(null), 350);
  }, []);

  // Group certs by domain
  const byDomain = DOMAINS.reduce<Record<Domain, Cert[]>>((acc, d) => {
    acc[d] = CERTS.filter((c) => c.domain === d);
    return acc;
  }, {} as Record<Domain, Cert[]>);

  // Split domains into two columns
  const leftDomains: Domain[] = ["networking", "ai-data", "web-dev"];
  const rightDomains: Domain[] = ["cloud-db", "analytics", "badges"];

  return (
    <>
      <section
        className="relative w-full min-h-screen"
        style={{ background: "#000008", overflow: "hidden" }}
      >
        {/* ── Deep-space grid background ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Depth fog layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(0,229,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(161,138,255,0.04) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
          {/* ── Section Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00E5FF]" />
              <span
                className="font-mono text-[9px] tracking-[0.35em] uppercase"
                style={{ color: "rgba(0,229,255,0.65)" }}
              >
                CREDENTIAL_VAULT · ENCRYPTED_STORAGE · {new Date().getFullYear()}
              </span>
            </div>

            <h1 className="font-display font-black uppercase leading-none tracking-tight mb-5 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="text-white">Credential</span>{" "}
              <span
                className="animate-glitch"
                style={{
                  background: "linear-gradient(135deg,#00E5FF 0%,#A18AFF 50%,#FF6B6B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Vault
              </span>
            </h1>

            {/* System Status Bar */}
            <div
              className="rounded-xl overflow-hidden max-w-3xl"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,4,12,0.7)" }}
            >
              <div className="flex items-center gap-3 px-5 py-2.5 border-b border-white/[0.04]">
                <div className="flex gap-1.5">
                  {["#FF4D4D", "#FFD700", "#39FF14"].map((c) => (
                    <div key={c} className="w-[7px] h-[7px] rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-white/20 flex-1">
                  ENCRYPTED_CREDENTIAL_RACK.SYS — DEEP STORAGE ARRAY
                </span>
                <motion.span
                  className="font-mono text-[7px] tracking-[0.2em] text-white/15"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  ONLINE
                </motion.span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/[0.05]">
                {[
                  { label: "TOTAL CARTRIDGES", value: String(CERTS.length).padStart(2, "0"), color: "#00E5FF" },
                  { label: "DOMAIN BAYS",       value: String(DOMAINS.length).padStart(2, "0"),  color: "#A18AFF" },
                  { label: "ISSUERS",            value: "12+",    color: "#39FF14" },
                ].map((s) => (
                  <div key={s.label} className="px-5 py-4 text-center">
                    <div
                      className="font-display font-black text-2xl sm:text-3xl mb-1 tabular-nums"
                      style={{ color: s.color, textShadow: `0 0 20px ${s.color}60` }}
                    >
                      {s.value}
                    </div>
                    <div className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/22">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-mono text-[9px] text-white/25 tracking-[0.2em] uppercase mt-5">
              HOVER CARTRIDGE TO EJECT · CLICK TO OPEN CERTIFICATE · ALL CREDENTIALS CRYPTOGRAPHICALLY SIGNED
            </p>
          </motion.div>

          {/* ── The Server Rack ── */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            style={{ perspective: "1200px" }}
          >
            {/* Left Column */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, rotateY: -6, x: -40 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {leftDomains.map((domain) => (
                <DomainBay
                  key={domain}
                  domain={domain}
                  certs={byDomain[domain]}
                  ejectedId={ejectedId}
                  onEject={handleEject}
                  onLeave={handleLeave}
                  onOpen={setOpenCert}
                />
              ))}
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, rotateY: 6, x: 40 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {rightDomains.map((domain) => (
                <DomainBay
                  key={domain}
                  domain={domain}
                  certs={byDomain[domain]}
                  ejectedId={ejectedId}
                  onEject={handleEject}
                  onLeave={handleLeave}
                  onOpen={setOpenCert}
                />
              ))}
            </motion.div>
          </div>

          {/* ── Footer ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-20 flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
            <span className="font-mono text-[8px] text-white/15 tracking-[0.3em] uppercase">
              — CREDENTIAL_VAULT · DEEP STORAGE · {new Date().getFullYear()} —
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/8 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Vault Modal Lightbox ── */}
      <AnimatePresence>
        {openCert && (
          <VaultModal cert={openCert} onClose={() => setOpenCert(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
