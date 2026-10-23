import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ExpertiseSection from "@/components/sections/ExpertiseSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroSection />

      <div className="section-divider" />

      {/* ── About ── */}
      <AboutSection />

      <div className="section-divider" />

      {/* ── Projects ── */}
      <ProjectsSection />

      <div className="section-divider" />

      {/* ── Experience ── */}
      <ExperienceTimeline />

      <div className="section-divider" />

      {/* ── Skills & Highlights ── */}
      <ExpertiseSection />

      <div className="section-divider" />

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
