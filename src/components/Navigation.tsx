"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { name: "HOME",       href: "#home",       sectionId: "home"       },
  { name: "ABOUT",      href: "#about",      sectionId: "about"      },
  { name: "SKILLS",     href: "#skills",     sectionId: "skills"     },
  { name: "EXPERIENCE", href: "#experience", sectionId: "experience" },
  { name: "PROJECTS",   href: "#projects",   sectionId: "projects"   },
  { name: "RECORDS",    href: "#records",    sectionId: "records"    },
  { name: "CONTACT",    href: "#contact",    sectionId: "contact"    },
];

// ─── Smooth-scroll helper ─────────────────────────────────────────────────────
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH = 96; // nav bar height + gap
  const top = el.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top, behavior: "smooth" });
}

// ─── Scroll-spy hook ──────────────────────────────────────────────────────────
function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        {
          rootMargin: "-40% 0px -55% 0px", // fires when section crosses the middle band
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Only run scroll-spy on the home page
  const isHome = pathname === "/";
  const sectionIds = navItems.map((i) => i.sectionId);
  const activeSection = useActiveSection(isHome ? sectionIds : []);

  // For non-home pages keep the old path-based active logic
  function isActive(item: (typeof navItems)[number]) {
    if (isHome) return activeSection === item.sectionId;
    // Fallback for any remaining separate pages
    return pathname.startsWith("/" + item.sectionId);
  }

  function handleNavClick(
    e: React.MouseEvent,
    item: (typeof navItems)[number]
  ) {
    if (isHome) {
      e.preventDefault();
      setIsOpen(false);
      scrollToSection(item.sectionId);
    } else {
      // Navigate to home then scroll once loaded
      setIsOpen(false);
    }
  }

  // href: on home page use "#id", on other pages use "/#id"
  function resolveHref(item: (typeof navItems)[number]) {
    return isHome ? item.href : `/${item.href}`;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass-panel rounded-full px-6 py-4 flex items-center justify-between"
      >
        {/* Logo */}
        <a
          href={isHome ? "#home" : "/"}
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              scrollToSection("home");
            }
          }}
          className="font-display font-bold text-lg md:text-xl tracking-wider text-white"
        >
          Mourya&apos;s Domain
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={resolveHref(item)}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                "relative font-mono text-xs tracking-widest transition-colors duration-300 cursor-pointer",
                isActive(item) ? "text-white" : "text-ash hover:text-white"
              )}
            >
              {item.name}
              {isActive(item) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-2 h-[2px] bg-teal shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                />
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (isHome) {
                scrollToSection("contact");
              }
            }}
            className="hidden sm:block"
          >
            {isHome ? (
              <span className="bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian font-mono text-xs px-6 py-2.5 rounded-full hover-lift uppercase font-bold tracking-widest inline-block">
                INITIATE
              </span>
            ) : (
              <Link
                href="/#contact"
                className="bg-gradient-to-br from-lavender to-[#8d7fff] text-obsidian font-mono text-xs px-6 py-2.5 rounded-full hover-lift uppercase font-bold tracking-widest inline-block"
              >
                INITIATE
              </Link>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
          >
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
              className="w-6 h-0.5 bg-white rounded-full block"
            />
            <motion.span
              animate={{ opacity: isOpen ? 0 : 1 }}
              className="w-6 h-0.5 bg-white rounded-full block"
            />
            <motion.span
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
              className="w-6 h-0.5 bg-white rounded-full block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-8 items-center">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                >
                  <a
                    href={resolveHref(item)}
                    onClick={(e) => handleNavClick(e, item)}
                    className={cn(
                      "font-display text-4xl font-bold tracking-tighter transition-colors cursor-pointer",
                      isActive(item) ? "text-teal" : "text-white"
                    )}
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (isHome) scrollToSection("contact");
                }}
                className="mt-8"
              >
                <span className="bg-gradient-to-br from-teal to-lavender text-obsidian font-mono text-sm px-10 py-4 rounded-full font-bold tracking-[0.2em] inline-block">
                  INITIATE_COMMS
                </span>
              </button>
            </div>

            <div className="absolute bottom-10 font-mono text-[10px] text-ash tracking-widest opacity-40">
              -- SECURE_DOMAIN_V2.0 --
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
