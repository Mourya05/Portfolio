import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExpertiseSection from "@/components/sections/ExpertiseSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import CertificationsSection from "@/components/sections/CertificationsSection";

export const metadata: Metadata = {
  title: "Mourya Birru | Mourya's Domain",
  description:
    "Portfolio of Mourya Birru. AI Engineer and Data Scientist. Exploring Agentic AI & Low-Level Systems.",
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
      <section id="records">
        <AchievementsSection />

        {/* Divider */}
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="flex items-center gap-5 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 shrink-0">
              ── CREDENTIAL_STORE ──
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        <CertificationsSection />
      </section>

      {/* ── Contact ── */}
      <section id="contact">
        <div className="relative w-full flex flex-col px-6 lg:px-24 items-center justify-center min-h-[80vh]">
          <div className="glass-panel p-10 rounded-2xl flex flex-col items-center max-w-2xl text-center">
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              INITIATE // CONTACT
            </h2>
            <p className="font-sans text-ash text-sm mb-8 leading-relaxed">
              Open to connecting on agentic swarms, data science architectures,
              and neural systems optimization.
            </p>
            <div className="flex flex-col gap-6 items-center">
              <a
                href="mailto:mourya.birru@gmail.com"
                className="bg-gradient-to-br from-[#A18AFF] to-[#8d7fff] text-obsidian px-8 py-3 rounded-md font-mono text-xs uppercase tracking-widest font-bold hover-lift"
              >
                Transmit Signal
              </a>
              <span className="font-mono text-[10px] text-teal tracking-[0.2em] opacity-60">
                SECURE_CHANNEL: mourya.birru@gmail.com
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
