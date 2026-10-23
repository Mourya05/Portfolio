"use client";

/* ─── 3 Skill Groups (Strict Order: ML & Data, Software, Systems & Tools) ─── */
const skillGroups = [
  {
    label: "ML & Data",
    items: [
      "Python",
      "PyTorch",
      "PyTorch Geometric",
      "OpenCV",
      "R",
      "Bayesian inference",
      "SQL",
    ],
  },
  {
    label: "Software",
    items: [
      "React",
      "React Native",
      "Node.js",
      "FastAPI",
      "REST APIs",
      "SQLite",
      "Supabase",
      "Redis",
    ],
  },
  {
    label: "Systems & Tools",
    items: [
      "C",
      "C++",
      "CUDA",
      "x86 Assembly",
      "Linux/POSIX",
      "BLE",
      "Git",
      "Docker",
    ],
  },
];

/* ─── Highlights (Two-column rows: title left, context right) ─────────────── */
const highlights = [
  {
    title: "GATE CSE 2026",
    context: "AIR 9602",
  },
  {
    title: "CTF Hackathon, Best Student",
    context: "Supraja Technologies (2025)",
  },
  {
    title: "Agentation 2025 Finalist",
    context: "Agentic AI Hackathon, Malla Reddy University",
  },
  {
    title: "Smart Interviews GCET-2027-R",
    context: "Rank 1 (college-wide competitive programming)",
  },
];

/* ─── Certifications ─────────────────────────────────────────────────────── */
const certifications = [
  { name: "CCNA: Introduction to Networks", issuer: "Cisco" },
  { name: "Advanced Programming in C", issuer: "Cisco" },
  { name: "MongoDB Associate Developer", issuer: "MongoDB" },
];

export default function ExpertiseSection() {
  return (
    <section id="skills" className="py-20 lg:py-28">
      <div className="section-wrap">
        
        {/* 4.3 Eyebrow: Chamfered square + Label + Hairline */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="w-2 h-2 shrink-0 bg-[var(--accent)]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
          />
          <span className="mono text-xs uppercase tracking-widest text-[var(--muted)]">
            Skills
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="tracking-tight text-white font-semibold mb-14"
          style={{
            fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
            lineHeight: 1.1,
          }}
        >
          Technical Stack
        </h2>

        {/* 1. Skills: Chamfered Boxes for the 3 Groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {skillGroups.map((group) => (
            <div key={group.label} className="chamfer-card">
              <div className="chamfer-card-inner p-6 flex flex-col h-full">
                <h3 className="mono text-xs uppercase tracking-widest text-[var(--accent)] mb-4 font-semibold">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Highlights & Certifications: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Highlights: Two-column rows in chamfered card */}
          <div>
            <h3 className="mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
              Highlights
            </h3>
            <div className="chamfer-card">
              <div className="chamfer-card-inner divide-y divide-[var(--border)]">
                {highlights.map((h) => (
                  <div
                    key={h.title}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">
                      {h.title}
                    </span>
                    <span className="mono text-xs text-[var(--muted)] shrink-0 sm:text-right">
                      {h.context}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications: Chamfered card */}
          <div>
            <h3 className="mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
              Certifications
            </h3>
            <div className="chamfer-card">
              <div className="chamfer-card-inner divide-y divide-[var(--border)]">
                {certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <span className="text-sm font-medium text-white">
                      {cert.name}
                    </span>
                    <span className="mono text-xs text-[var(--muted)] shrink-0">
                      {cert.issuer}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
