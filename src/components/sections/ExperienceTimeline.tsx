"use client";

interface Experience {
  company: string;
  role:    string;
  period:  string;
  tags:    string[];
  bullets: string[];
}

const experiences: Experience[] = [
  {
    company: "Nucleonix Systems",
    role:    "R&D Intern, Embedded Systems",
    period:  "Feb 2026 – Jun 2026",
    tags:    ["React Native", "BLE/NUS", "Arduino", "SQLite", "Supabase", "Node.js", "Expo"],
    bullets: [
      "Contributed to the Tab-Based GM Counting System — a tablet app for real-time radiation monitoring.",
      "Integrated Nordic UART Service (NUS) BLE communication between the app and Arduino-based GM detector hardware.",
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
    ],
  },
  {
    company: "Agnirva",
    role:    "AI Intern",
    period:  "Apr 2025 – Jun 2025",
    tags:    ["Generative AI", "Python", "Prompt Engineering"],
    bullets: [
      "Three-month internship at a space-tech AI organisation. Contributed to AI research and development pipelines.",
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
  return (
    <section id="experience" className="py-20 lg:py-28">
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
            Experience
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
          Internships
        </h2>

        {/* Plain Rows: 3-column grid (Date 160px | Spine with Square Marker | Content) */}
        <div className="flex flex-col gap-10 mb-20">
          {experiences.map((exp, idx) => (
            <div
              key={exp.company + exp.period}
              className="grid grid-cols-1 md:grid-cols-[160px_24px_1fr] gap-y-2 md:gap-x-6 items-start"
            >
              {/* Date Column: 160px on desktop, right-aligned to spine */}
              <div className="md:text-right pt-0.5">
                <span className="mono text-xs text-[var(--muted)] block">
                  {exp.period}
                </span>
              </div>

              {/* Spine with Square Marker (Desktop) */}
              <div className="hidden md:flex flex-col items-center self-stretch relative">
                <span
                  className="w-2 h-2 bg-[var(--accent)] shrink-0 mt-1"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                />
                {idx < experiences.length - 1 && (
                  <span className="w-[1px] bg-[var(--border)] flex-1 mt-2.5" />
                )}
              </div>

              {/* Content Right */}
              <div className="w-full">
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {exp.role}
                  </h3>
                  <span className="text-sm font-medium text-[var(--muted)]">
                    · {exp.company}
                  </span>
                </div>

                {/* Bullets */}
                <ul className="flex flex-col gap-1.5 mb-4 text-sm text-[var(--muted)] leading-relaxed list-none p-0">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--accent)] shrink-0 mt-0.5">–</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Neutral Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Plain Community Section */}
        <div>
          <h3 className="mono text-xs uppercase tracking-widest text-[var(--muted)] mb-4">
            Community
          </h3>
          <div className="chamfer-card">
            <div className="chamfer-card-inner divide-y divide-[var(--border)]">
              {community.map((c) => (
                <div
                  key={c.org + c.period}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-white">{c.role}</span>
                    <span className="text-sm text-[var(--muted)]"> — {c.org}</span>
                  </div>
                  <span className="mono text-xs text-[var(--muted)] shrink-0">
                    {c.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
