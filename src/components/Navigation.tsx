"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home",       href: "#home",       id: "home"       },
  { name: "About",      href: "#about",      id: "about"      },
  { name: "Projects",   href: "#projects",   id: "projects"   },
  { name: "Experience", href: "#experience", id: "experience" },
  { name: "Skills",     href: "#skills",     id: "skills"     },
  { name: "Contact",    href: "#contact",    id: "contact"    },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "smooth" });
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const ids = navItems.map((i) => i.id);
  const active = useActiveSection(ids);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(8,9,11,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: "var(--max-w)", margin: "0 auto", padding: "0 24px", height: "60px" }}
        >
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
            className="font-semibold text-base hover-accent"
            style={{ color: "var(--text)", textDecoration: "none", letterSpacing: "-0.01em" }}
            aria-label="Back to top"
          >
            Mourya Birru
          </a>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}
                className={cn(
                  "mono text-xs tracking-wider transition-colors duration-150",
                  active === item.id
                    ? "nav-active"
                    : "hover-accent"
                )}
                style={{ color: active === item.id ? "var(--accent)" : "var(--muted)", textDecoration: "none" }}
                aria-current={active === item.id ? "page" : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className="block w-5 h-0.5 transition-all duration-200"
              style={{
                background: "var(--text)",
                transform: open ? "rotate(45deg) translateY(6px)" : "",
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-200"
              style={{
                background: "var(--text)",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-200"
              style={{
                background: "var(--text)",
                transform: open ? "rotate(-45deg) translateY(-6px)" : "",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(8,9,11,0.97)", backdropFilter: "blur(16px)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                setTimeout(() => scrollTo(item.id), 50);
              }}
              className="text-3xl font-semibold hover-accent transition-colors"
              style={{
                color: active === item.id ? "var(--accent)" : "var(--text)",
                textDecoration: "none",
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
