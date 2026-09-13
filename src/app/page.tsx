import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExpertiseSection from "@/components/sections/ExpertiseSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import CertificationsSection from "@/components/sections/CertificationsSection";

export const metadata: Metadata = {
  title: "Mourya Birru | Systems & Embedded Engineer",
  description:
    "Portfolio of Mourya Birru — Systems & Embedded Software Engineer specializing in BLE hardware integration, x86 OS development, POSIX systems programming, and industrial IoT.",
  openGraph: {
    title: "Mourya Birru | Systems & Embedded Engineer",
    description: "Systems & Embedded Software Engineer — BLE, bare-metal OS, Linux/POSIX systems programming.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="relative w-full flex flex-col">
      {/* ── Hero ── */}
      <section id="home">
        <HeroSection />
      </section>

      {/* ── About ── */}
      <section id="about">
        <AboutSection />
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <ExpertiseSection />
      </section>

      {/* ── Experience ── */}
      <section id="experience">
        <ExperienceTimeline />
      </section>

      {/* ── Projects ── */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* ── Records: Achievements + Certifications ── */}
      <section id="records" className="relative w-full">
        <AchievementsSection />

        {/* Divider */}
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="flex items-center gap-5 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 shrink-0">
              ── Certifications ──
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        <CertificationsSection />
      </section>

      {/* ── Contact ── */}
      <section id="contact">
        <div className="relative w-full flex flex-col px-4 sm:px-6 lg:px-24 items-center justify-center min-h-[80vh]">
          <div className="glass-panel p-6 sm:p-10 rounded-2xl flex flex-col items-center max-w-2xl w-full text-center">
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-white mb-4">
              Get In Touch
            </h2>
            <p className="font-sans text-ash text-sm mb-8 leading-relaxed">
              Open to Systems / Embedded / SDE roles and internships.
              Happy to discuss hardware integration, OS internals, or anything you&apos;d like to collaborate on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
              <a
                href="mailto:mourya.birru@gmail.com"
                className="w-full sm:w-auto bg-gradient-to-br from-[#A18AFF] to-[#8d7fff] text-obsidian px-8 py-4 rounded-md font-mono text-xs uppercase tracking-widest font-bold hover-lift min-h-[48px] flex items-center justify-center"
                aria-label="Send email to Mourya Birru"
              >
                Send Email
              </a>
              <a
                href="/Mourya_Resume.pdf"
                download="Mourya_Resume.pdf"
                className="w-full sm:w-auto bg-black/60 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-md font-mono text-xs uppercase tracking-widest hover-lift min-h-[48px] flex items-center justify-center"
                aria-label="Download Mourya Birru resume PDF"
              >
                Download Resume
              </a>
            </div>
            <span className="font-mono text-[10px] text-teal/60 tracking-[0.2em] mt-6 break-all px-4">
              mourya.birru@gmail.com
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
