"use client";

const education = [
  {
    school: "Geethanjali College of Engineering and Technology (GCET)",
    degree: "B.Tech in Computer Science and Engineering",
    period: "Sep 2023 – Jan 2027",
    grade: "8.22 / 10.0 GPA",
  },
  {
    school: "Resonance Eduventures / RGUKT Basar",
    degree: "Intermediate (MPC)",
    period: "2021 – 2023",
    grade: "84.9%",
  },
];

const facts = [
  { label: "Location", value: "Hyderabad, India" },
  { label: "Degree", value: "B.Tech CSE (2027)" },
  { label: "College", value: "GCET" },
  { label: "GPA", value: "8.22 / 10.0" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28">
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
            About
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border)] ml-2" />
        </div>

        <h2
          className="tracking-tight text-white font-semibold mb-12"
          style={{
            fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
            lineHeight: 1.1,
          }}
        >
          Background
        </h2>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-start">
          
          {/* Bio text & Quick facts */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              <p className="text-[var(--text)] font-normal">
                I&apos;m a final-year Computer Science student at Geethanjali College of Engineering and Technology in Hyderabad. I&apos;m looking for roles in AI/ML, data science and software development.
              </p>
              <p>
                My projects range from machine learning (a graph attention network for Ethereum mempool anomalies, a Bayesian character recognizer, an LLM inference engine in CUDA) to full-stack apps that talk to real hardware. Building foundational pieces myself, like a small x86 kernel and a Unix shell, taught me to debug and reason about performance, which I bring to ML and software work.
              </p>
            </div>

            {/* Facts Strip (Chamfered Card) */}
            <div className="chamfer-card">
              <div className="chamfer-card-inner p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex flex-col">
                    <span className="mono text-[11px] text-[var(--muted)] uppercase tracking-wider mb-1">
                      {f.label}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education column */}
          <div className="flex flex-col gap-4">
            <h3 className="mono text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
              Education
            </h3>
            {education.map((edu) => (
              <div key={edu.school} className="chamfer-card">
                <div className="chamfer-card-inner p-5">
                  <span className="mono text-xs text-[var(--muted)] block mb-1">
                    {edu.period}
                  </span>
                  <h4 className="text-base font-semibold text-white mb-1">
                    {edu.school}
                  </h4>
                  <p className="text-sm text-[var(--muted)] mb-2">
                    {edu.degree}
                  </p>
                  <span className="mono text-xs font-medium text-[var(--accent)]">
                    {edu.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
