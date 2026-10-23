"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
    note: "[TODO: confirm which institution and exact years]",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.querySelectorAll(".reveal").forEach((el) => {
            if (entry.isIntersecting) el.classList.add("visible");
          });
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about-inner"
      ref={sectionRef}
      style={{ paddingTop: "96px", paddingBottom: "96px" }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>About</p>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              lineHeight: 1.15,
            }}
          >
            Background
          </h2>
        </div>

        {/* Content grid */}
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 460px), 1fr))" }}
        >
          {/* Bio */}
          <div className="reveal flex flex-col gap-6">
            {/* Profile photo */}
            <div
              className="card overflow-hidden"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Image
                src="/myphoto.jpeg"
                alt="Mourya Birru, final-year CS student at GCET Hyderabad"
                fill
                sizes="120px"
                className="object-cover object-top"
                priority
              />
            </div>

            <div style={{ maxWidth: "62ch" }}>
              <p style={{ color: "var(--text)", lineHeight: 1.7, marginBottom: "16px" }}>
                I am a final-year B.Tech CSE student at Geethanjali College of Engineering and Technology (GCET), Hyderabad, graduating in 2027.
                I am drawn to low-level systems programming and hardware-connected software, and I build projects to understand them from the ground up.
              </p>
              <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                My work ranges from writing a 32-bit x86 kernel in C and NASM, to building a CUDA-based LLM inference engine, to developing a BLE radiation-monitoring mobile app during my internship at Nucleonix Systems.
                I am looking for roles where I can work close to the hardware or the OS layer.
              </p>
            </div>

            {/* Quick facts */}
            <div
              className="card"
              style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}
            >
              {[
                ["Location", "Hyderabad, India"],
                ["Degree", "B.Tech CSE (4th year)"],
                ["College", "GCET"],
                ["GPA", "8.22 / 10.0"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="mono" style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
                    {label}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text)" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="reveal flex flex-col gap-4">
            <h3
              className="mono"
              style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px" }}
            >
              Education
            </h3>
            {education.map((edu) => (
              <div
                key={edu.school}
                className="card"
                style={{
                  padding: "20px",
                  borderLeft: "2px solid var(--accent)",
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                }}
              >
                <p className="mono" style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "6px" }}>
                  {edu.period}
                </p>
                <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "4px", lineHeight: 1.3 }}>
                  {edu.school}
                </p>
                <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "8px" }}>
                  {edu.degree}
                </p>
                <p className="mono" style={{ fontSize: "12px", color: "var(--accent)" }}>
                  {edu.grade}
                </p>
                {edu.note && (
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px", fontStyle: "italic" }}>
                    {edu.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
