"use client";

import { useEffect, useRef } from "react";

const skillGroups = [
  {
    label: "Languages",
    items: ["C", "C++", "Python", "Java", "JavaScript", "R", "SQL", "x86 Assembly (NASM)"],
  },
  {
    label: "Systems & Hardware",
    items: ["Linux / POSIX", "BLE / Nordic UART (NUS)", "Arduino", "QEMU", "CUDA", "GDT / IDT / Paging"],
  },
  {
    label: "Software",
    items: ["React Native", "Node.js", "REST APIs", "SQLite", "Supabase", "React", "Expo"],
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "GNU Make", "Docker"],
  },
];

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 60);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills-inner"
      ref={sectionRef}
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>Skills</p>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              lineHeight: 1.15,
            }}
          >
            Technical skills
          </h2>
        </div>

        {/* Skill groups */}
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))" }}
        >
          {skillGroups.map((group) => (
            <div key={group.label} className="reveal">
              <h3
                className="mono"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "14px",
                }}
              >
                {group.label}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {group.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                        opacity: 0.6,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Highlights (replaces Achievements carousel) */}
        <div className="reveal" style={{ marginTop: "72px" }}>
          <h3
            className="mono"
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            Highlights
          </h3>
          <div className="flex flex-col" style={{ gap: "0" }}>
            {[
              "GATE CSE 2026 — AIR 9602",
              "IEEE Xtreme 18.0 — [TODO: confirm rank out of total teams and exact platform]",
              "CTF Hackathon — Best Student Award, Supraja Technologies (2025)",
              "Ramanujan Mathematical Competition — National Finalist [TODO: confirm round/year details]",
              "Agentation 2025 — Finalist, Agentic AI Hackathon, Malla Reddy University",
              "Smart Interviews GCET-2027-R — Rank 1 (college-wide competitive programming)",
            ].map((item, idx, arr) => (
              <div
                key={idx}
                style={{
                  fontSize: "14px",
                  color: "var(--muted)",
                  padding: "10px 0",
                  borderTop: idx === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                  lineHeight: 1.5,
                  fontStyle: item.includes("[TODO") ? "italic" : "normal",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications (replaces Credential Vault) */}
        <div className="reveal" style={{ marginTop: "48px" }}>
          <h3
            className="mono"
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "16px",
            }}
          >
            Certifications
          </h3>
          <div className="flex flex-col" style={{ gap: "0" }}>
            {[
              { name: "CCNA: Introduction to Networks", issuer: "Cisco" },
              { name: "Advanced Programming in C", issuer: "Cisco" },
              { name: "MongoDB Associate Developer", issuer: "MongoDB" },
            ].map((cert, idx) => (
              <div
                key={cert.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "10px 0",
                  borderTop: idx === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "14px", color: "var(--text)" }}>{cert.name}</span>
                <span className="mono" style={{ fontSize: "11px", color: "var(--muted)", flexShrink: 0 }}>{cert.issuer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
