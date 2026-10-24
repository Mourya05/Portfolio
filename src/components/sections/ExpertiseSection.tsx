"use client";

type TagVariant = "tag-ml" | "tag-software" | "tag-systems";

const skillGroups: { label: string; variant: TagVariant; count: number; items: string[] }[] = [
  {
    label:   "ML & Data",
    variant: "tag-ml",
    count:   7,
    items:   ["Python", "PyTorch", "PyTorch Geometric", "OpenCV", "R", "Bayesian inference", "SQL"],
  },
  {
    label:   "Software",
    variant: "tag-software",
    count:   8,
    items:   ["React", "React Native", "Node.js", "FastAPI", "REST APIs", "SQLite", "Supabase", "Redis"],
  },
  {
    label:   "Systems & Tools",
    variant: "tag-systems",
    count:   8,
    items:   ["C", "C++", "CUDA", "x86 Assembly", "Linux/POSIX", "BLE", "Git", "Docker"],
  },
];

const highlights = [
  { title: "GATE CSE 2026", context: "AIR 9602",                                         isKey: true  },
  { title: "CTF Hackathon, Best Student",   context: "Supraja Technologies (2025)",       isKey: false },
  { title: "Agentation 2025 Finalist",      context: "Agentic AI Hackathon, Malla Reddy", isKey: false },
  { title: "Smart Interviews GCET-2027-R",  context: "Rank 1",                            isKey: true  },
];

const certifications = [
  { name: "CCNA: Introduction to Networks",   issuer: "Cisco"   },
  { name: "Advanced Programming in C",        issuer: "Cisco"   },
  { name: "MongoDB Associate Developer",      issuer: "MongoDB" },
];

/* Gradient text span */
function GradSpan({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: "linear-gradient(90deg, var(--violet-hi), var(--crimson))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: 700,
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      {children}
    </span>
  );
}

export default function ExpertiseSection() {
  return (
    <section id="skills" className="py-28 lg:py-36">
      <div className="section-wrap">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 shrink-0"
            style={{ background: "var(--violet)", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }}
          />
          <span className="eyebrow">Skills</span>
          <div className="flex-1 h-px ml-2" style={{ background: "var(--border)" }} />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold mb-14"
          style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", lineHeight: 1.08, color: "white" }}
        >
          Technical Stack
        </h2>

        {/* Skill boxes — 3 equal-height columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {skillGroups.map((group) => (
            <div key={group.label} className="chamfer-card h-full">
              <div className="chamfer-card-inner p-7 flex flex-col h-full">
                {/* Header with count */}
                <div className="flex items-baseline justify-between gap-2 mb-5">
                  <h3
                    className="mono font-semibold uppercase tracking-widest"
                    style={{ fontSize: "12px", color: "var(--violet-hi)", letterSpacing: "0.12em" }}
                  >
                    {group.label}
                  </h3>
                  <span
                    className="mono"
                    style={{ fontSize: "11px", color: "var(--muted)" }}
                  >
                    {group.count}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <span key={item} className={`tag ${group.variant}`}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights + Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

          {/* Highlights — dominant */}
          <div>
            <h3
              className="mono uppercase tracking-widest font-semibold mb-5"
              style={{ fontSize: "12px", color: "var(--violet-hi)", letterSpacing: "0.12em" }}
            >
              Highlights
            </h3>
            <div className="chamfer-card">
              <div className="chamfer-card-inner divide-y" style={{ borderColor: "var(--border)" }}>
                {highlights.map((h) => (
                  <div
                    key={h.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors hover:bg-[var(--surface-2)]"
                    style={{
                      padding: h.isKey ? "18px 20px" : "14px 20px",
                    }}
                  >
                    <span
                      className="font-semibold text-white"
                      style={{ fontSize: h.isKey ? "16px" : "14px" }}
                    >
                      {h.title}
                    </span>
                    <span
                      className="mono shrink-0 sm:text-right"
                      style={{ fontSize: h.isKey ? "15px" : "12px" }}
                    >
                      {h.isKey
                        ? <GradSpan>{h.context}</GradSpan>
                        : <span style={{ color: "var(--muted)" }}>{h.context}</span>
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications — quieter */}
          <div>
            <h3
              className="mono uppercase tracking-widest mb-5"
              style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.12em" }}
            >
              Certifications
            </h3>
            <div className="chamfer-card">
              <div className="chamfer-card-inner divide-y" style={{ borderColor: "var(--border)" }}>
                {certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors hover:bg-[var(--surface-2)]"
                    style={{ padding: "14px 20px" }}
                  >
                    <span className="font-medium text-white" style={{ fontSize: "15px" }}>
                      {cert.name}
                    </span>
                    <span className="mono shrink-0" style={{ fontSize: "12px", color: "var(--muted)" }}>
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
