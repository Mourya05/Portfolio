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
    role:    "Software Engineer Intern",
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
  { role: "PR Head",                    org: "GCET Coding Club",                period: "Dec 2024 – Jun 2026" },
  { role: "Webmaster",                  org: "IEEE Education Society (EdSoc)",   period: "Aug 2025 – Dec 2025" },
  { role: "Google Student Ambassador",  org: "Google",                           period: "Jul 2025 – Dec 2025" },
  { role: "Student Member",             org: "ISTE",                             period: "Feb 2024 – Present"  },
  { role: "Student Member",             org: "IEEE Computer Society",            period: "Sep 2024 – Dec 2025" },
];

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="py-28 lg:py-36">
      <div className="section-wrap">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 shrink-0"
            style={{ background: "var(--violet)", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }}
          />
          <span className="eyebrow">Experience</span>
          <div className="flex-1 h-px ml-2" style={{ background: "var(--border)" }} />
        </div>

        <h2
          className="section-heading tracking-tight font-semibold mb-16"
          style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", lineHeight: 1.08, color: "white" }}
        >
          Internships
        </h2>

        {/* Timeline entries */}
        <div className="flex flex-col gap-12 mb-22" style={{ marginBottom: "88px" }}>
          {experiences.map((exp, idx) => (
            <div
              key={exp.company + exp.period}
              className="timeline-entry grid grid-cols-1 md:grid-cols-[180px_28px_1fr] gap-y-2 md:gap-x-8 items-start"
            >
              {/* Date */}
              <div className="md:text-right pt-1">
                <span className="mono" style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.05em" }}>
                  {exp.period}
                </span>
              </div>

              {/* Spine */}
              <div className="hidden md:flex flex-col items-center self-stretch relative">
                <span className="timeline-node" />
                {idx < experiences.length - 1 && <span className="timeline-spine" />}
              </div>

              {/* Content */}
              <div className="w-full">
                <div className="flex flex-wrap items-baseline gap-2 mb-3">
                  <h3 className="font-semibold text-white" style={{ fontSize: "1.1rem" }}>
                    {exp.role}
                  </h3>
                  <span className="font-medium" style={{ fontSize: "16px", color: "var(--muted)" }}>
                    · {exp.company}
                  </span>
                </div>

                <ul className="flex flex-col gap-2 mb-5 list-none p-0" style={{ fontSize: "16px" }}>
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5" style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                      <span className="shrink-0 mt-0.5" style={{ color: "var(--violet)" }}>–</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community */}
        <div>
          <h3 className="eyebrow mb-4" style={{ color: "var(--muted)" }}>
            Community
          </h3>
          <div className="chamfer-card">
            <div className="chamfer-card-inner divide-y" style={{ borderColor: "var(--border)" }}>
              {community.map((c) => (
                <div
                  key={c.org + c.period}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all"
                  style={{ padding: "14px 20px", cursor: "default" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.backgroundColor = "rgba(139,92,246,0.08)";
                    const title = el.querySelector<HTMLElement>(".community-role");
                    if (title) title.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.backgroundColor = "";
                    const title = el.querySelector<HTMLElement>(".community-role");
                    if (title) title.style.color = "";
                  }}
                >
                  <div>
                    <span className="community-role font-medium text-white transition-colors" style={{ fontSize: "15px" }}>
                      {c.role}
                    </span>
                    <span style={{ fontSize: "15px", color: "var(--muted)" }}> — {c.org}</span>
                  </div>
                  <span className="mono shrink-0" style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.05em" }}>
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
