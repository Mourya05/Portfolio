"use client";

import { useEffect, useRef } from "react";

interface Experience {
  company:  string;
  role:     string;
  period:   string;
  tags:     string[];
  bullets:  string[];
}

const experiences: Experience[] = [
  {
    company: "Nucleonix Systems",
    role:    "R&D Intern — Embedded Systems",
    period:  "Feb 2026 – Jun 2026",
    tags:    ["React Native", "BLE/NUS", "Arduino", "SQLite", "Supabase", "Node.js", "Expo"],
    bullets: [
      "Contributed to the Tab-Based GM Counting System — a tablet app for real-time radiation monitoring.",
      "Integrated Nordic UART Service (NUS) BLE communication between the app and Arduino-based GM detector hardware.",
      "Built device-based access control using Android Device ID authenticated via Supabase.",
      "Implemented on-device SQLite storage and Node.js/REST backend support.",
      "[TODO: confirm exactly what I built vs the broader team]",
    ],
  },
  {
    company: "Avasan Chakra",
    role:    "Software Development Engineer Intern",
    period:  "Apr 2026 – May 2026",
    tags:    ["Software Design", "Sustainable Tech"],
    bullets: [
      "Two-month remote internship at a startup focused on sustainable solutions for high-rise buildings.",
      "Worked on algorithmic problem-solving and software development tasks.",
      "[TODO: add one concrete deliverable]",
    ],
  },
  {
    company: "Supraja Technologies",
    role:    "Cyber Security Intern",
    period:  "May 2025 – Aug 2025",
    tags:    ["Kali Linux", "Network Security", "OSINT"],
    bullets: [
      "Four-month on-site internship in Vijayawada.",
      "Gained hands-on exposure to offensive and defensive security methodologies in simulated environments.",
      "Worked with Kali Linux tools and OSINT reconnaissance workflows.",
      "Documented findings in vulnerability reports.",
    ],
  },
  {
    company: "Agnirva",
    role:    "AI Intern",
    period:  "Apr 2025 – Jun 2025",
    tags:    ["Generative AI", "Python", "Prompt Engineering"],
    bullets: [
      "Three-month internship at a space-tech AI organisation.",
      "Contributed to AI research and development pipelines.",
      "[TODO: add one concrete deliverable]",
    ],
  },
];

const community = [
  { role: "PR Head", org: "GCET Coding Club", period: "Dec 2024 – Jun 2026" },
  { role: "Webmaster", org: "IEEE Education Society (EdSoc)", period: "Aug 2025 – Dec 2025" },
  { role: "Google Student Ambassador", org: "Google", period: "Jul 2025 – Dec 2025" },
  { role: "Student Member", org: "ISTE", period: "Feb 2024 – Present" },
  { role: "Student Member", org: "IEEE Computer Society", period: "Sep 2024 – Dec 2025" },
];

export default function ExperienceTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80);
            });
          }
        });
      },
      { threshold: 0.04 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience-inner"
      ref={sectionRef}
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>Experience</p>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              lineHeight: 1.15,
            }}
          >
            Internships
          </h2>
        </div>

        {/* Experience list */}
        <div className="flex flex-col" style={{ gap: "24px", marginBottom: "72px" }}>
          {experiences.map((exp) => (
            <article
              key={exp.company + exp.period}
              className="card reveal"
              style={{ padding: "24px" }}
            >
              {/* Header row */}
              <div
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
                style={{ marginBottom: "12px" }}
              >
                <div>
                  <h3 style={{ fontWeight: 600, color: "var(--text)", lineHeight: 1.3, marginBottom: "2px" }}>
                    {exp.role}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--accent)" }}>
                    {exp.company}
                  </p>
                </div>
                <p
                  className="mono shrink-0"
                  style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.05em", paddingTop: "2px" }}
                >
                  {exp.period}
                </p>
              </div>

              {/* Bullets */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {exp.bullets.map((b, i) => (
                  <li key={i} style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.65, display: "flex", gap: "10px" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>–</span>
                    <span style={b.startsWith("[TODO") ? { fontStyle: "italic" } : {}}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Community */}
        <div className="reveal">
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
            Community
          </h3>
          <div className="flex flex-col" style={{ gap: "0" }}>
            {community.map((c, idx) => (
              <div
                key={c.org + c.period}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px 0",
                  borderTop: idx === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <span style={{ fontSize: "14px", color: "var(--text)" }}>{c.role}</span>
                  <span style={{ fontSize: "14px", color: "var(--muted)" }}> — {c.org}</span>
                </div>
                <span
                  className="mono shrink-0"
                  style={{ fontSize: "11px", color: "var(--muted)" }}
                >
                  {c.period}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
