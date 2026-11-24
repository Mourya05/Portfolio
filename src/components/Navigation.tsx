"use client";

import { useState, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaCode } from "react-icons/fa6";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type CmdItem = {
  id: string;
  label: string;
  meta?: string;
  group: string;
  action: () => void;
  icon?: React.ReactNode;
};

/* ─── Cmd+K Command Palette ─────────────────────────────────────────────── */
function CommandPalette({
  open,
  onClose,
  onJarvis,
}: {
  open: boolean;
  onClose: () => void;
  onJarvis: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: "smooth" });
    onClose();
  }

  const commands: CmdItem[] = [
    { id: "nav-projects",   label: "Go to Projects",   group: "Navigate",  action: () => scrollTo("projects")   },
    { id: "nav-experience", label: "Go to Experience",  group: "Navigate",  action: () => scrollTo("experience") },
    { id: "nav-stack",      label: "Go to Stack",       group: "Navigate",  action: () => scrollTo("stack")      },
    { id: "nav-contact",    label: "Go to Contact",     group: "Navigate",  action: () => scrollTo("contact")    },
    { id: "nav-telem",      label: "Go to Telemetry",   group: "Navigate",  action: () => scrollTo("telemetry")  },
    {
      id: "open-github", label: "Open GitHub", meta: "mourya05", group: "Links",
      icon: <FaGithub size={13} />,
      action: () => { window.open("https://github.com/mourya05", "_blank"); onClose(); }
    },
    {
      id: "open-linkedin", label: "Open LinkedIn", meta: "mourya-birru", group: "Links",
      icon: <FaLinkedin size={13} />,
      action: () => { window.open("https://linkedin.com/in/mourya-birru", "_blank"); onClose(); }
    },
    {
      id: "open-leetcode", label: "Open LeetCode", meta: "mourya_birru", group: "Links",
      icon: <FaCode size={13} />,
      action: () => { window.open("https://leetcode.com/u/mourya_birru/", "_blank"); onClose(); }
    },
    {
      id: "open-resume", label: "Download Resume", group: "Links",
      icon: <FaDownload size={13} />,
      action: () => { const a = document.createElement("a"); a.href = "/Mourya_Resume.pdf"; a.download = "Mourya_Birru_Resume.pdf"; a.click(); onClose(); }
    },
    {
      id: "copy-email", label: "Copy Email", meta: "mourya.birru@gmail.com", group: "Links",
      icon: <FaEnvelope size={13} />,
      action: () => { navigator.clipboard.writeText("mourya.birru@gmail.com"); onClose(); }
    },
  ];

  const q = query.trim().toLowerCase();

  // Easter egg detection
  useEffect(() => {
    if (q === "jarvis" || q === "stark") {
      onJarvis();
      onClose();
    }
  }, [q, onJarvis, onClose]);

  const filtered = q
    ? commands.filter(c => c.label.toLowerCase().includes(q) || (c.meta && c.meta.toLowerCase().includes(q)))
    : commands;

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    if (open) { setQuery(""); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); filtered[selected]?.action(); }
      if (e.key === "Escape")    { onClose(); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, selected, onClose]);

  const groups = ["Navigate", "Links"];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="cmd-backdrop"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.96, y: -6, x: "-50%" }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="cmd-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span className="mono" style={{ color: "var(--muted)", fontSize: 12 }}>⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                }}
                aria-label="Search commands"
              />
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--subtle)",
                  padding: "2px 6px",
                  border: "1px solid var(--border)",
                  letterSpacing: "0.06em",
                }}
              >
                ESC
              </span>
            </div>

            {/* Results */}
            <div style={{ maxHeight: "340px", overflowY: "auto", padding: "8px 0" }}>
              {filtered.length === 0 ? (
                <p
                  className="mono"
                  style={{ padding: "16px 20px", color: "var(--subtle)", fontSize: 12 }}
                >
                  No results for &quot;{query}&quot;
                </p>
              ) : (
                groups.map(group => {
                  const items = filtered.filter(c => c.group === group);
                  if (!items.length) return null;
                  return (
                    <div key={group}>
                      <p
                        className="mono"
                        style={{
                          padding: "6px 16px 4px",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          color: "var(--subtle)",
                          textTransform: "uppercase",
                        }}
                      >
                        {group}
                      </p>
                      {items.map((item) => {
                        const isSelected = filtered.indexOf(item) === selected;
                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelected(filtered.indexOf(item))}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              width: "100%",
                              padding: "9px 16px",
                              background: isSelected ? "rgba(245,158,11,0.08)" : "transparent",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              borderLeft: isSelected ? "2px solid var(--amber)" : "2px solid transparent",
                              transition: "background 0.1s",
                            }}
                          >
                            {item.icon && (
                              <span style={{ color: isSelected ? "var(--amber)" : "var(--muted)", flexShrink: 0 }}>
                                {item.icon}
                              </span>
                            )}
                            {!item.icon && (
                              <span
                                style={{
                                  width: 13,
                                  height: 13,
                                  flexShrink: 0,
                                  borderBottom: "1.5px solid currentColor",
                                  borderRight: "1.5px solid currentColor",
                                  display: "inline-block",
                                  transform: "rotate(-45deg) scale(0.65)",
                                  color: isSelected ? "var(--amber)" : "var(--muted)",
                                }}
                              />
                            )}
                            <span style={{ fontSize: 13, color: isSelected ? "var(--text)" : "var(--muted)", flex: 1, fontFamily: "var(--font-body)" }}>
                              {item.label}
                            </span>
                            {item.meta && (
                              <span className="mono" style={{ fontSize: 11, color: "var(--subtle)" }}>
                                {item.meta}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              className="mono"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 16px",
                borderTop: "1px solid var(--border)",
                fontSize: 10,
                color: "var(--subtle)",
              }}
            >
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Nav items ──────────────────────────────────────────────────────────── */
const navItems = [
  { name: "Work",       href: "#projects",   id: "projects"   },
  { name: "Experience", href: "#experience", id: "experience" },
  { name: "Stack",      href: "#stack",      id: "stack"      },
  { name: "Contact",    href: "#contact",    id: "contact"    },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 68;
  window.scrollTo({ top, behavior: "smooth" });
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, [ids]);
  return active;
}

export function Navigation() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jarvisActive, setJarvisActive] = useState(false);
  const ids = navItems.map(i => i.id);
  const active = useActiveSection(ids);

  // Scroll progress hairline
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  // Keyboard shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Auto-dismiss JARVIS after 6 seconds
  useEffect(() => {
    if (!jarvisActive) return;
    const t = setTimeout(() => setJarvisActive(false), 6000);
    return () => clearTimeout(t);
  }, [jarvisActive]);

  // Close mobile on resize
  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  function handleJarvis() {
    setJarvisActive(true);
  }

  return (
    <>
      {/* ── Sticky header (fixed at top of viewport) ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(7, 8, 10, 0.94)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          height: 56,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", height: "100%" }}
        >
          {/* Logo — monospace identifier */}
          <a
            href="#home"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="mono group flex items-center gap-1.5 transition-colors"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--text)",
              textDecoration: "none",
              userSelect: "none",
            }}
            aria-label="Back to top"
          >
            <span className="text-amber-500 opacity-80 group-hover:opacity-100 transition-opacity">●</span>
            <span>MOURYA.BIRRU</span>
            <span style={{ color: "var(--muted)" }}>// SYS_ML</span>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
            {navItems.map(item => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={e => { e.preventDefault(); scrollToSection(item.id); }}
                  className="mono relative py-1"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: isActive ? "var(--text)" : "var(--muted)",
                    transition: "color 0.15s ease",
                  }}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
                >
                  {item.name}
                  {/* Framer Motion layoutId active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F59E0B]"
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
                    />
                  )}
                </a>
              );
            })}

            {/* ⌘K button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setCmdOpen(true)}
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "var(--muted)",
                background: "transparent",
                border: "1px solid var(--border)",
                padding: "4px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "border-color 0.14s, color 0.14s",
              }}
              aria-label="Open command palette"
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border-mid)"; el.style.color = "var(--text)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--muted)"; }}
            >
              <span>⌘K</span>
            </motion.button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className="block w-5 h-px transition-all duration-200"
              style={{ background: "var(--text)", transform: mobileOpen ? "rotate(45deg) translateY(5px)" : "" }} />
            <span className="block w-5 h-px transition-all duration-200"
              style={{ background: "var(--text)", opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-5 h-px transition-all duration-200"
              style={{ background: "var(--text)", transform: mobileOpen ? "rotate(-45deg) translateY(-5px)" : "" }} />
          </button>
        </div>

        {/* ── Scroll progress hairline (pinned to bottom edge of sticky navbar) ── */}
        <motion.div
          className="absolute -bottom-[1px] left-0 right-0 h-[1.5px] bg-[#F59E0B] pointer-events-none origin-left z-30 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
          style={{ scaleX }}
        />
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-9"
            style={{ background: "rgba(7, 8, 10, 0.98)", backdropFilter: "blur(12px)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {navItems.map(item => (
              <a
                key={item.id}
                href={item.href}
                onClick={e => {
                  e.preventDefault();
                  setMobileOpen(false);
                  setTimeout(() => scrollToSection(item.id), 60);
                }}
                className="mono"
                style={{
                  fontSize: 20,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: active === item.id ? "var(--amber)" : "var(--muted)",
                  textDecoration: "none",
                }}
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setCmdOpen(true); }}
              className="mono"
              style={{
                fontSize: 13,
                color: "var(--muted)",
                background: "transparent",
                border: "1px solid var(--border)",
                padding: "8px 20px",
                cursor: "pointer",
                letterSpacing: "0.08em",
                marginTop: 12,
              }}
            >
              ⌘K — Command Palette
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onJarvis={handleJarvis}
      />

      {/* JARVIS Blueprint Overlay */}
      <AnimatePresence>
        {jarvisActive && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="blueprint-overlay"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 12, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 12, x: "-50%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
              className="jarvis-toast"
              role="status"
              aria-live="polite"
            >
              J.A.R.V.I.S. // DIAGNOSTICS ONLINE — ALL SYSTEMS NOMINAL
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
