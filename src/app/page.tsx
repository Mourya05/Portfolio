import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ExpertiseSection from "@/components/sections/ExpertiseSection";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Mourya Birru | CS Student, Systems & Software",
  description:
    "Mourya Birru — final-year CS student at GCET, Hyderabad. Building low-level systems and hardware-connected software. Open to SDE, systems, and embedded internships.",
  openGraph: {
    title: "Mourya Birru | CS Student, Systems & Software",
    description:
      "Final-year CS student building low-level systems and hardware-connected software. Open to SDE, systems, and embedded internships.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mourya Birru — CS Student, Systems & Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section id="home">
        <HeroSection />
      </section>

      {/* ── About ── */}
      <section id="about">
        <AboutSection />
      </section>

      {/* ── Projects ── */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* ── Experience ── */}
      <section id="experience">
        <ExperienceTimeline />
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <ExpertiseSection />
      </section>

      {/* ── Contact ── */}
      <section id="contact">
        <div
          style={{
            paddingTop: "96px",
            paddingBottom: "96px",
          }}
        >
          <div className="section-wrap">
            <div style={{ maxWidth: "540px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>Contact</p>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  lineHeight: 1.15,
                  marginBottom: "20px",
                }}
              >
                Get in touch
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                  maxWidth: "50ch",
                }}
              >
                I am open to SDE, systems, and embedded internships and entry-level roles.
                Feel free to reach out about projects, collaboration, or opportunities.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3" style={{ marginBottom: "32px" }}>
                <a
                  href="mailto:mourya.birru@gmail.com"
                  className="btn-primary"
                  style={{ minHeight: "44px" }}
                  aria-label="Send email to mourya.birru@gmail.com"
                >
                  Email me
                </a>
                <a
                  href="/Mourya_Resume.pdf"
                  download="Mourya_Resume.pdf"
                  className="btn-outline"
                  style={{ minHeight: "44px" }}
                  aria-label="Download resume PDF"
                >
                  Resume
                </a>
              </div>

              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/Mourya05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover-accent transition-colors mono"
                  style={{ color: "var(--muted)", textDecoration: "none", fontSize: "13px" }}
                  aria-label="GitHub profile"
                >
                  <FaGithub size={16} />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/mourya-birru-8336342a7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover-accent transition-colors mono"
                  style={{ color: "var(--muted)", textDecoration: "none", fontSize: "13px" }}
                  aria-label="LinkedIn profile"
                >
                  <FaLinkedin size={16} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
