"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface ExperienceEntry {
  date: string;
  company: string;
  role: string;
  skills: string[];
  type: "INTERNSHIP" | "ROLE" | "MEMBERSHIP";
  accent: string;
  accentBg: string;
  description: string;
  logId: string;
}

const experiences: ExperienceEntry[] = [
  {
    date: "FEB 2026 – JUN 2026",
    company: "NUCLEONIX SYSTEMS",
    role: "R&D Engineering Intern, Embedded Systems",
    type: "INTERNSHIP",
    accent: "#FF9F1C",
    accentBg: "rgba(255,159,28,0.08)",
    logId: "S_009",
    skills: [
      "React Native",
      "Node.js",
      "REST APIs",
      "Expo",
      "SQLite",
      "Nordic UART (NUS)",
      "Arduino",
      "BLE Integration",
      "Supabase",
      "Device Access Control",
      "Real-Time Deployment"
    ],
    description:
      "Contributed to the development and real-time deployment of the tablet-optimized radiation monitoring mobile application (TAB-Based GM Counting System). Programmed secure client access by retrieving the unique Android Device ID and authenticating it via Supabase-driven Device Based Access Control, integrated Nordic UART Service (NUS) BLE communication with Arduino-based hardware detectors, built backend support with Node.js/REST APIs, and implemented on-device SQLite database structures.",
  },
  {
    date: "APR 2026 – MAY 2026",
    company: "AVASAN CHAKRA",
    role: "Software Development Engineer Intern",
    type: "INTERNSHIP",
    accent: "#00E5FF",
    accentBg: "rgba(0,229,255,0.08)",
    logId: "S_001",
    skills: ["Software Design", "Collaboration", "Sustainable Technology Design"],
    description:
      "As a Software Development Engineer Intern at Avasan Chakra (Startup), I engaged in a two-month remote role starting in April 2026. Reporting directly to the CTO, I was responsible for tackling algorithmic problem-solving and advancing various software development projects. My work actively contributed to the company's mission of driving innovative, sustainable, and eco-friendly solutions tailored for high-rise buildings. This opportunity allowed me to apply my technical skills to meaningful sustainability initiatives within a collaborative environment centered on clarity and precision",
  },
  {
    date: "DEC 2024 – JUN 2026",
    company: "GCET CODING CLUB",
    role: "PR Head",
    type: "ROLE",
    accent: "#A18AFF",
    accentBg: "rgba(161,138,255,0.08)",
    logId: "S_002",
    skills: ["Leadership", "Communication", "Event Management", "Community Building"],
    description:
      "Serving as the Public Relations Head of the GCET Coding Club, driving outreach, technical event coordination, and cross-departmental collaborations. Spearheaded multiple initiatives to grow the club's presence, bridge the gap between students and industry professionals, and cultivate a culture of engineering curiosity within the campus ecosystem.",
  },
  {
    date: "FEB 2024 – PRESENT",
    company: "ISTE",
    role: "Student Member",
    type: "MEMBERSHIP",
    accent: "#94A3B8",
    accentBg: "rgba(148,163,184,0.08)",
    logId: "S_003",
    skills: ["Technical Leadership", "Networking", "Professional Development"],
    description:
      "Active member of the Indian Society for Technical Education (ISTE), engaging with a national network of engineering professionals and students. Participating in workshops, seminars, and technical symposia that sharpen both domain expertise and professional acumen — reinforcing a lifelong commitment to continuous learning and engineering excellence.",
  },
  {
    date: "AUG 2025 – DEC 2025",
    company: "IEEE EdSoc",
    role: "Webmaster",
    type: "ROLE",
    accent: "#39FF14",
    accentBg: "rgba(57,255,20,0.06)",
    logId: "S_004",
    skills: ["Python", "SQL", "JavaScript", "Web Infrastructure", "Database Management"],
    description:
      "Operated as Webmaster for IEEE Educational Society, owning the full web infrastructure stack. Designed and maintained web portals used by hundreds of members, implemented backend data pipelines in Python & SQL, and ensured platform uptime and security. Collaborated closely with the chapter leadership to digitize event management workflows and enhance the user experience for a diverse technical audience.",
  },
  {
    date: "JUL 2025 – DEC 2025",
    company: "GOOGLE",
    role: "Student Ambassador",
    type: "ROLE",
    accent: "#FFD700",
    accentBg: "rgba(255,215,0,0.06)",
    logId: "S_005",
    skills: ["Time Management", "Leadership", "Google Cloud", "Developer Relations"],
    description:
      "Selected as a Google Student Ambassador — a competitive program that identifies high-potential engineering students to represent Google's developer ecosystem on campus. Organized workshops, cloud bootcamps, and hackathons that introduced students to Google's product suite and AI tooling. Acted as a conduit between the campus community and Google's developer relations team, mentoring peers on cloud architecture and responsible AI practices.",
  },
  {
    date: "SEP 2024 – DEC 2025",
    company: "IEEE COMPUTER SOCIETY",
    role: "Student Member",
    type: "MEMBERSHIP",
    accent: "#00E5FF",
    accentBg: "rgba(0,229,255,0.06)",
    logId: "S_006",
    skills: ["C", "Algorithms", "Analytical Thinking", "Systems Research"],
    description:
      "Member of the IEEE Computer Society, the world's premier organization for computer science professionals. Engaged in deep technical discourse around algorithms, systems architecture, and emerging paradigms in computing. Access to cutting-edge research publications and participation in student conferences directly sharpened analytical rigor and informed the development approach across hardware and OS-level projects.",
  },
  {
    date: "MAY 2025 – AUG 2025",
    company: "SUPRAJA TECHNOLOGIES",
    role: "Cyber Security Intern",
    type: "INTERNSHIP",
    accent: "#FF4D4D",
    accentBg: "rgba(255,77,77,0.06)",
    logId: "S_007",
    skills: ["Ethical Hacking", "Kali Linux", "Penetration Testing", "Network Security", "OSINT"],
    description:
      "Completed an intensive cyber security internship at Supraja Technologies, gaining hands-on exposure to offensive and defensive security methodologies. Conducted penetration tests on simulated network environments using Kali Linux, executed OSINT reconnaissance workflows, and documented vulnerability reports. This experience deepened understanding of attack surfaces at both the network and application layer — knowledge that directly informs how software is written securely at a systems level.",
  },
  {
    date: "APR 2025 – JUN 2025",
    company: "AGNIRVA.COM SPACE",
    role: "AI Intern",
    type: "INTERNSHIP",
    accent: "#A18AFF",
    accentBg: "rgba(161,138,255,0.08)",
    logId: "S_008",
    skills: ["Generative AI", "LLMs", "Prompt Engineering", "Python", "AI Research"],
    description:
      "Interned at Agnirva, a space-tech AI organization, working at the frontier of generative AI and large language model applications. Contributed to research and development pipelines involving LLM fine-tuning, multi-modal prompt engineering, and AI-assisted data processing for aerospace-adjacent datasets. This role cultivated a rigorous understanding of agentic AI architectures and the ethical deployment of intelligent systems in high-stakes domains.",
  },
];

const typeColors: Record<string, string> = {
  INTERNSHIP: "#FFD700",
  ROLE: "#00E5FF",
  MEMBERSHIP: "#94A3B8",
};

function TimelineNode({
  exp,
  index,
  isLeft,
}: {
  exp: ExperienceEntry;
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative flex w-full items-start mb-8 sm:mb-12
        /* Mobile: always left-to-right single column */
        flex-row
        /* Desktop: alternate sides */
        ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}
      `}
    >
      {/* Card — full-width on mobile, half-width on lg */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          w-full lg:w-[calc(50%-2.5rem)] group relative
          pl-10 lg:pl-0
          ${isLeft ? "lg:mr-10" : "lg:ml-10"}
        `}
      >
        {/* Desktop connector line — hidden on mobile */}
        <div
          className="absolute top-6 hidden lg:block"
          style={{
            [isLeft ? "right" : "left"]: "-2.5rem",
            width: "2.5rem",
            height: "1px",
            background: `linear-gradient(${isLeft ? "to left" : "to right"}, transparent, ${exp.accent}55)`,
          }}
        />

        <motion.div
          className="rounded-xl border border-white/5 p-5 sm:p-6 relative overflow-hidden cursor-default"
          style={{ background: hovered ? exp.accentBg : "rgba(255,255,255,0.02)" }}
          animate={{ borderColor: hovered ? `${exp.accent}40` : "rgba(255,255,255,0.05)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Scanline top bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(to right, transparent, ${exp.accent}, transparent)` }}
            animate={{ opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />

          {/* Log ID */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="font-mono text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 rounded"
              style={{ color: typeColors[exp.type], border: `1px solid ${typeColors[exp.type]}33`, background: `${typeColors[exp.type]}11` }}
            >
              {exp.type}
            </span>
            <span className="font-mono text-[9px] text-white/20 tracking-widest">{exp.logId}</span>
          </div>

          {/* Date */}
          <div className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: `${exp.accent}99` }}>
            [{exp.date}]
          </div>

          {/* Role & Company */}
          <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight mb-0.5 group-hover:text-teal transition-colors duration-300">
            {exp.role}
          </h3>
          <p className="font-mono text-[11px] tracking-widest uppercase mb-4" style={{ color: exp.accent, opacity: 0.7 }}>
            @ {exp.company}
          </p>

          {/* Description */}
          <p className="font-sans text-xs text-white/60 leading-relaxed mb-5 group-hover:text-white/80 transition-colors duration-300">
            {exp.description}
          </p>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-1.5">
            {exp.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[9px] tracking-wider px-2 py-0.5 rounded"
                style={{ color: exp.accent, background: `${exp.accent}11`, border: `1px solid ${exp.accent}22` }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Animated bottom scan on hover */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(to right, transparent, ${exp.accent}, transparent)` }}
            animate={{ opacity: hovered ? 0.6 : 0, scaleX: hovered ? 1 : 0.5 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </motion.div>

      {/* Timeline dot — left edge on mobile, center on desktop */}
      <div className="absolute left-0 lg:left-1/2 -translate-x-1/2 top-4 flex flex-col items-center z-10
        /* Mobile: shift dot to left edge with small offset */
        translate-x-[14px] lg:translate-x-[-50%]
      ">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: exp.accent,
            background: hovered ? exp.accent : "rgba(10,11,18,1)",
            boxShadow: hovered ? `0 0 16px ${exp.accent}` : `0 0 6px ${exp.accent}55`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: exp.accent }} />
        </motion.div>
      </div>
    </div>
  );
}


export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-24 flex flex-col">
      {/* Header */}
      <div className="mb-16 sm:mb-24">
        <p className="font-mono text-teal text-[10px] tracking-widest uppercase mb-4 opacity-80">
          [ LOG_TYPE: DEPLOYMENT_HISTORY ]
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white">
          DEPLOYMENT{" "}
          <span className="text-lavender italic opacity-90">// TIMELINE</span>
        </h2>
        <p className="font-sans text-ash/60 text-sm mt-4 max-w-xl leading-relaxed">
          A chronological log of active engagements, internship deployments, and organizational roles — each entry a node in the growth matrix.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-16 font-mono text-[10px] tracking-widest uppercase">
        {(["ROLE", "INTERNSHIP", "MEMBERSHIP"] as const).map((t) => (
          <span key={t} className="flex items-center gap-2" style={{ color: typeColors[t] }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: typeColors[t] }} />
            {t}
          </span>
        ))}
      </div>

      {/* Timeline container */}
      <div ref={containerRef} className="relative w-full">
        {/* Center spine */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] hidden lg:block overflow-hidden">
          <motion.div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(0,229,255,0.2) 10%, rgba(161,138,255,0.2) 50%, rgba(0,229,255,0.2) 90%, transparent)",
            }}
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* Mobile vertical line — aligned with the dot offset */}
        <div className="absolute left-[14px] top-0 bottom-0 w-[1px] lg:hidden" style={{ background: "rgba(0,229,255,0.15)" }} />

        {/* Entries */}
        <div className="relative">
          {experiences.map((exp, idx) => (
            <TimelineNode key={exp.logId} exp={exp} index={idx} isLeft={idx % 2 === 0} />
          ))}
        </div>
      </div>

      {/* Footer system ticker */}
      <div className="mt-16 sm:mt-24 border-t border-white/10 pt-6 overflow-x-auto">
        <div className="flex items-center gap-6 sm:gap-12 font-mono text-xs text-ash tracking-[0.2em] uppercase whitespace-nowrap opacity-40 pb-2">
          {["SYSTEM_ACTIVE", "NODES: 9", "STATUS: OPERATIONAL", "UPTIME: 20_YRS", "PROTOCOL: ASYNC_GROWTH"].map(
            (t, i) => (
              <span key={i} className="flex items-center gap-4 shrink-0">
                {t} <span className="w-1.5 h-1.5 rounded-full bg-teal/40" />
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
