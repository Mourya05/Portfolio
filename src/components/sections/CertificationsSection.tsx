"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "all" | "networking" | "cloud-db" | "ai-data" | "analytics" | "web-dev" | "badges";

interface Cert {
  title: string;
  issuer: string;
  category: Category;
  icon: string;
  accentColor: string;
  hexColor: string;
  year?: string;
  image?: string; // path under /certificates/
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CERTS: Cert[] = [
  {
    title: "ADK Crash Course",
    issuer: "Google",
    category: "badges",
    icon: "🤖",
    accentColor: "#4285F4",
    hexColor: "#4285F4",
    year: "Jun 2026",
    // no image yet
  },
  // Networking
  {
    title: "Network Technician",
    issuer: "Cisco",
    category: "networking",
    icon: "🌐",
    accentColor: "#00E5FF",
    hexColor: "#00E5FF",
    year: "Oct 2025",
    image: "/certificates/Network_Technician_Career_Path_certificate.jpg",
  },
  {
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    category: "networking",
    icon: "📡",
    accentColor: "#00E5FF",
    hexColor: "#00E5FF",
    year: "Oct 2025",
    image: "/certificates/CCNA-_Introduction_to_Networks_certificate.jpg",
  },

  // Cloud / DB / Dev
  {
    title: "Certified Developer, Associate (C100DEV)",
    issuer: "MongoDB",
    category: "cloud-db",
    icon: "🍃",
    accentColor: "#00ED64",
    hexColor: "#00ED64",
    year: "Jul 2025",
    image: "/certificates/MongoDB Certificate_page-0001.jpg",
  },
  {
    title: "Software Engineer Skills",
    issuer: "Electronic Arts (EA)",
    category: "cloud-db",
    icon: "🎮",
    accentColor: "#A18AFF",
    hexColor: "#A18AFF",
    year: "Jan 2025",
    image: "/certificates/Software Engineering Skills.jpg",
  },

  // AI & Data Science
  {
    title: "80 Days of GenAI Mastery",
    issuer: "Udemy",
    category: "ai-data",
    icon: "🤖",
    accentColor: "#FF6B6B",
    hexColor: "#FF6B6B",
    year: "May 2025",
    image: "/certificates/80 Days of Gen AI Mastery.jpg",
  },
  {
    title: "Data Science & ML Bootcamp with R",
    issuer: "Udemy",
    category: "ai-data",
    icon: "📊",
    accentColor: "#FF6B6B",
    hexColor: "#FF6B6B",
    year: "Apr 2025",
    image: "/certificates/R.jpg",
  },
  {
    title: "Machine Learning in Python",
    issuer: "365 Data Science",
    category: "ai-data",
    icon: "🧠",
    accentColor: "#FFA500",
    hexColor: "#FFA500",
    year: "Nov 2024",
    image: "/certificates/CC-AC98253341_page-0001.jpg",
  },
  {
    title: "Generative AI",
    issuer: "Microsoft",
    category: "ai-data",
    icon: "✨",
    accentColor: "#00A4EF",
    hexColor: "#00A4EF",
    year: "Aug 2024",
    image: "/certificates/Build Your Generative AI Productivity Skills with Microsoft and LinkedIn.jpg",
  },
  {
    title: "Introduction to Generative AI Studio",
    issuer: "Google Cloud",
    category: "ai-data",
    icon: "☁️",
    accentColor: "#4285F4",
    hexColor: "#4285F4",
    year: "Jul 2024",
    image: "/certificates/Introduction to Generative AI Studio.png",
  },

  // Analytics
  {
    title: "Data Visualization",
    issuer: "Tata Group",
    category: "analytics",
    icon: "📈",
    accentColor: "#00E5FF",
    hexColor: "#00E5FF",
    year: "Nov 2024",
    image: "/certificates/Tata forage_page-0001.jpg",
  },
  {
    title: "Data Analytics and Visualization",
    issuer: "Accenture",
    category: "analytics",
    icon: "🔍",
    accentColor: "#A100FF",
    hexColor: "#A100FF",
    year: "Sep 2024",
    image: "/certificates/Accenture Data Analysis.jpg",
  },
  {
    title: "Power BI",
    issuer: "Simplilearn",
    category: "analytics",
    icon: "⚡",
    accentColor: "#F2C811",
    hexColor: "#F2C811",
    year: "Jul 2024",
    image: "/certificates/PowerBI.jfif",
  },

  // Web Dev
  {
    title: "The Complete Full-Stack Web Dev Bootcamp",
    issuer: "Udemy",
    category: "web-dev",
    icon: "💻",
    accentColor: "#FF6B6B",
    hexColor: "#FF6B6B",
    year: "Apr 2025",
    image: "/certificates/Web Development BootCamp.jpg",
  },
  {
    title: "Advanced Programming in C",
    issuer: "Cisco Networking Academy",
    category: "web-dev",
    icon: "⚙️",
    accentColor: "#00E5FF",
    hexColor: "#00E5FF",
    year: "Jun 2024",
    image: "/certificates/Advanced Programming in C.jpg",
  },
  {
    title: "Introduction to Python",
    issuer: "Infosys Springboard",
    category: "web-dev",
    icon: "🐍",
    accentColor: "#3776AB",
    hexColor: "#3776AB",
    year: "Nov 2024",
    image: "/certificates/Introduction to Python.jpg",
  },

  // Badges
  {
    title: "Top Interview 150 Badge",
    issuer: "LeetCode",
    category: "badges",
    icon: "🏆",
    accentColor: "#FFA116",
    hexColor: "#FFA116",
    year: "Apr 2025",
  },
  {
    title: "LeetCode 75",
    issuer: "LeetCode",
    category: "badges",
    icon: "🎯",
    accentColor: "#FFA116",
    hexColor: "#FFA116",
    year: "Apr 2025",
  },
  {
    title: "SQL",
    issuer: "HackerRank",
    category: "badges",
    icon: "🗄️",
    accentColor: "#2EC866",
    hexColor: "#2EC866",
    year: "Nov 2024",
    image: "/certificates/SQL HackerRank.jpg",
  },
  {
    title: "Problem Solving",
    issuer: "HackerRank",
    category: "badges",
    icon: "🧩",
    accentColor: "#2EC866",
    hexColor: "#2EC866",
    year: "Aug 2024",
    image: "/certificates/Problem Solving HackerRank.png",
  },
  {
    title: "Java",
    issuer: "HackerRank",
    category: "badges",
    icon: "☕",
    accentColor: "#2EC866",
    hexColor: "#2EC866",
    year: "Oct 2024",
    image: "/certificates/Java HackerRank.png",
  },
  {
    title: "Python",
    issuer: "HackerRank",
    category: "badges",
    icon: "🐍",
    accentColor: "#2EC866",
    hexColor: "#2EC866",
    year: "Aug 2024",
    image: "/certificates/Python HackerRank.png",
  },
];

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const TABS: { id: Category; label: string; shortLabel: string }[] = [
  { id: "all",        label: "All Credentials",  shortLabel: "All"       },
  { id: "networking", label: "Core Networking",   shortLabel: "Networking"},
  { id: "cloud-db",   label: "Cloud & Dev",       shortLabel: "Cloud"    },
  { id: "ai-data",    label: "AI & Data Science", shortLabel: "AI & Data"},
  { id: "analytics",  label: "Analytics",         shortLabel: "Analytics"},
  { id: "web-dev",    label: "Web & Programming", shortLabel: "Web Dev"  },
  { id: "badges",     label: "Verified Badges",   shortLabel: "Badges"   },
];

function countForTab(id: Category) {
  if (id === "all") return CERTS.length;
  return CERTS.filter((c) => c.category === id).length;
}

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseCertDate(year?: string): number {
  if (!year) return 0;
  const parts = year.trim().split(" ");
  if (parts.length === 2) {
    const [mon, yr] = parts;
    return new Date(parseInt(yr, 10), MONTH_MAP[mon] ?? 0).getTime();
  }
  return new Date(parseInt(parts[0], 10), 0).getTime();
}

function sortNewestFirst(certs: Cert[]): Cert[] {
  return [...certs].sort((a, b) => parseCertDate(b.year) - parseCertDate(a.year));
}

// ─── Certificate Lightbox Modal ───────────────────────────────────────────────
function CertModal({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <AnimatePresence>
      {/* ── Backdrop ── */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-20 sm:p-8 sm:pt-20"
        onClick={onClose}
        style={{
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Backdrop scan-line texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.012) 2px, rgba(0,229,255,0.012) 4px)",
          }}
        />

        {/* ── Frame ── */}
        <motion.div
          key="frame"
          initial={{ opacity: 0, scale: 0.82, y: 40, rotateX: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20, rotateX: -4 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[78vh] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(4, 4, 10, 0.95)",
            border: `1px solid ${cert.hexColor}55`,
            boxShadow: `0 0 0 1px ${cert.hexColor}22, 0 0 60px ${cert.hexColor}20, 0 40px 80px rgba(0,0,0,0.8)`,
          }}
        >
          {/* Animated neon border beam — top */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${cert.hexColor} 50%, transparent 100%)`,
            }}
            animate={{ backgroundPosition: ["200% center", "-200% center"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner accent marks */}
          {[
            "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
            "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
            "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
            "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-5 h-5 ${cls}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
              style={{ borderColor: cert.hexColor }}
            />
          ))}

          {/* ── Modal Header ── */}
          <div
            className="flex items-center justify-between px-5 py-3 shrink-0"
            style={{ borderBottom: `1px solid ${cert.hexColor}20` }}
          >
            {/* Left: title row */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Blinking status dot */}
              <motion.div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: cert.hexColor, boxShadow: `0 0 8px ${cert.hexColor}` }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <div className="min-w-0">
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase truncate"
                  style={{ color: cert.hexColor }}>
                  {cert.issuer} · CERT_VIEW
                </p>
                <p className="font-display font-bold text-sm text-white truncate leading-tight mt-0.5">
                  {cert.title}
                </p>
              </div>
            </div>

            {/* Right: close button */}
            <motion.button
              onClick={onClose}
              className="shrink-0 ml-4 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
              whileHover={{
                background: `${cert.hexColor}22`,
                borderColor: `${cert.hexColor}66`,
                color: cert.hexColor,
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close certificate viewer"
            >
              ✕
            </motion.button>
          </div>

          {/* ── Image Area ── */}
          <div className="relative flex-1 overflow-auto flex items-center justify-center min-h-0 bg-black/40 p-3 sm:p-5">
            {cert.image ? (
              <>
                {/* Subtle ambient glow behind image */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, ${cert.hexColor}0a 0%, transparent 70%)`,
                  }}
                />

                {/* Scan-line sweep animation */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${cert.hexColor}06 50%, transparent 100%)`,
                    backgroundSize: "100% 60px",
                  }}
                  animate={{ backgroundPositionY: ["0px", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                  className="relative max-w-full max-h-full"
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: `0 0 40px ${cert.hexColor}18, 0 20px 60px rgba(0,0,0,0.6)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    className="object-contain max-h-[50vh] w-auto h-auto block"
                    loading="eager"
                  />
                </motion.div>
              </>
            ) : (
              /* No-image placeholder */
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <motion.div
                  className="text-6xl"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {cert.icon}
                </motion.div>
                <p className="font-mono text-[11px] tracking-widest uppercase"
                  style={{ color: cert.hexColor }}>
                  CERTIFICATE IMAGE NOT AVAILABLE
                </p>
                <p className="font-sans text-xs text-white/30 max-w-xs">
                  The certificate image for this credential has not been uploaded yet.
                </p>
              </div>
            )}
          </div>

          {/* ── Modal Footer ── */}
          <div
            className="flex items-center justify-between px-5 py-2.5 shrink-0"
            style={{ borderTop: `1px solid ${cert.hexColor}15` }}
          >
            <div className="flex items-center gap-4">
              {cert.year && (
                <span
                  className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded"
                  style={{
                    background: `${cert.hexColor}14`,
                    color: cert.hexColor,
                    border: `1px solid ${cert.hexColor}28`,
                  }}
                >
                  ISSUED · {cert.year}
                </span>
              )}
              <span className="font-mono text-[8px] text-white/20 tracking-widest uppercase hidden sm:block">
                ESC TO CLOSE
              </span>
            </div>
            <span className="font-mono text-[8px] text-white/15 tracking-wider">
              CREDENTIAL_VIEW · {cert.category.toUpperCase()}
            </span>
          </div>

          {/* Ambient bottom glow */}
          <div
            className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${cert.hexColor}08, transparent)`,
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Single Card ──────────────────────────────────────────────────────────────
function CertCard({
  cert,
  index,
  onOpen,
}: {
  cert: Cert;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const hasImage = Boolean(cert.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={hasImage ? onOpen : undefined}
      className={cn(
        "relative group rounded-2xl overflow-hidden",
        hasImage ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        background: "rgba(4, 4, 10, 0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hovered ? cert.hexColor + "55" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered
          ? `0 0 30px ${cert.hexColor}22, 0 20px 50px rgba(0,0,0,0.6)`
          : "0 8px 32px rgba(0,0,0,0.5)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-4px) scale(1.015)" : "translateY(0) scale(1)",
      }}
      whileTap={hasImage ? { scale: 0.97 } : undefined}
    >
      {/* Border beam — top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${cert.hexColor}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Ambient background glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${cert.hexColor}12 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Card body */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-4 h-full">
        {/* Icon slot */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-400"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${cert.hexColor}22, ${cert.hexColor}08)`
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${hovered ? cert.hexColor + "44" : "rgba(255,255,255,0.08)"}`,
            boxShadow: hovered ? `0 0 14px ${cert.hexColor}40` : "none",
          }}
        >
          {cert.icon}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 flex-1">
          <h3
            className="font-display font-bold text-sm sm:text-base leading-snug transition-colors duration-300"
            style={{ color: hovered ? "#ffffff" : "#D1D1D1" }}
          >
            {cert.title}
          </h3>
          <p
            className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-300"
            style={{ color: hovered ? cert.hexColor : "rgba(209,209,209,0.45)" }}
          >
            {cert.issuer}
          </p>
        </div>

        {/* Bottom row — year badge + view hint */}
        {cert.year && (
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span
              className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded"
              style={{
                background: hovered ? `${cert.hexColor}18` : "rgba(255,255,255,0.04)",
                color: hovered ? cert.hexColor : "rgba(209,209,209,0.3)",
                border: `1px solid ${hovered ? cert.hexColor + "30" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.3s ease",
              }}
            >
              ISSUED · {cert.year}
            </span>

            {/* View hint OR credential dot */}
            {hasImage ? (
              <motion.span
                className="font-mono text-[8px] tracking-widest uppercase flex items-center gap-1"
                style={{ color: hovered ? cert.hexColor : "rgba(255,255,255,0.15)" }}
                animate={hovered ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
                transition={{ duration: 1.4, repeat: hovered ? Infinity : 0 }}
              >
                <span>VIEW</span>
                <span style={{ fontSize: "10px" }}>↗</span>
              </motion.span>
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: hovered ? cert.hexColor : "rgba(255,255,255,0.15)",
                  boxShadow: hovered ? `0 0 8px ${cert.hexColor}` : "none",
                  transition: "all 0.3s ease",
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Corner data tag */}
      <div className="absolute top-3 right-3">
        <span
          className="font-mono text-[8px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: cert.hexColor }}
        >
          {hasImage ? "CERT" : "BADGE"}
        </span>
      </div>

      {/* Click ripple indicator for cards with images */}
      {hasImage && hovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.06, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ background: cert.hexColor }}
        />
      )}
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CertificationsSection() {
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [openCert, setOpenCert] = useState<Cert | null>(null);

  const filtered = sortNewestFirst(
    activeTab === "all" ? CERTS : CERTS.filter((c) => c.category === activeTab)
  );

  return (
    <>
      <section className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Decorative top grid lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div className="absolute top-0 left-0 w-64 h-64 rounded-br-full"
            style={{ background: "radial-gradient(circle at top left, rgba(0,229,255,0.06), transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-tl-full"
            style={{ background: "radial-gradient(circle at bottom right, rgba(161,138,255,0.06), transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-14 sm:mb-20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-teal" />
              <span className="font-mono text-[10px] text-teal tracking-[0.3em] uppercase">
                SKILL_ARCHIVE · v2.0
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white uppercase leading-none tracking-tight mb-6">
              Certifications{" "}
              <span
                className="animate-glitch"
                style={{
                  background: "linear-gradient(135deg, #00E5FF, #A18AFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                &amp; Credentials
              </span>
            </h1>

            <p className="font-sans text-ash/70 text-sm sm:text-base max-w-2xl leading-relaxed">
              A curated record of verified expertise — spanning cloud infrastructure, artificial intelligence,
              data science, full-stack engineering, and competitive programming.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[
                { label: "Total Credentials", value: CERTS.length },
                { label: "Issuing Bodies", value: "12+" },
                { label: "Domains Covered", value: TABS.length - 1 },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="font-display font-bold text-2xl sm:text-3xl text-white">{s.value}</span>
                  <span className="font-mono text-[9px] text-ash/50 tracking-widest uppercase">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Filter Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-10 sm:mb-14"
          >
            <div
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    id={`cert-filter-${tab.id}`}
                    className={cn(
                      "relative shrink-0 font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap",
                      isActive
                        ? "text-obsidian border-teal bg-teal shadow-[0_0_18px_rgba(0,229,255,0.4)]"
                        : "text-ash/60 border-white/10 bg-white/3 hover:border-white/20 hover:text-white"
                    )}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    <span
                      className={cn(
                        "ml-2 px-1.5 py-px rounded text-[8px] font-bold",
                        isActive
                          ? "bg-obsidian/30 text-obsidian"
                          : "bg-white/8 text-ash/40"
                      )}
                    >
                      {countForTab(tab.id)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              <span className="font-mono text-[10px] text-ash/40 tracking-widest">
                DISPLAYING {filtered.length} OF {CERTS.length} RECORDS · CLICK CARD TO VIEW CERTIFICATE
              </span>
            </div>
          </motion.div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((cert, i) => (
                <CertCard
                  key={`${cert.title}-${cert.issuer}`}
                  cert={cert}
                  index={i}
                  onOpen={() => setOpenCert(cert)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* ── Footer note ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 flex items-center gap-4"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
            <span className="font-mono text-[9px] text-ash/25 tracking-widest">
              -- CREDENTIAL_STORE · ENCRYPTED · {new Date().getFullYear()} --
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-white/5 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Cert Lightbox ── */}
      <AnimatePresence>
        {openCert && (
          <CertModal cert={openCert} onClose={() => setOpenCert(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
