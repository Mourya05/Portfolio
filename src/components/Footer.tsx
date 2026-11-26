"use client";

import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}
    >
      {/* Footer bar */}
      <div
        className="mono"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 28px",
          height: 44,
          borderBottom: "1px solid var(--border)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--subtle)",
        }}
      >
        <span>MOURYA.BIRRU // SYS_ML</span>
        <span>HYD, IN</span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 28px",
          gap: "8px 24px",
        }}
      >
        <p className="mono" style={{ fontSize: 11, color: "var(--subtle)", margin: 0 }}>
          © {new Date().getFullYear()} Mourya Birru · Final-year CS · GCET, Hyderabad
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[
            { href: "https://github.com/mourya05",          icon: <FaGithub size={13} />,   label: "GitHub"   },
            { href: "https://linkedin.com/in/mourya-birru", icon: <FaLinkedin size={13} />, label: "LinkedIn" },
            { href: "https://leetcode.com/u/Mourya_birru/", icon: <FaCode size={13} />,     label: "LeetCode" },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono inline-flex items-center gap-1.5"
              style={{ fontSize: 11, color: "var(--muted)", textDecoration: "none", transition: "color 0.14s" }}
              aria-label={link.label}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
            >
              {link.icon}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
