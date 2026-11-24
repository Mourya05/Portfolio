import HeroSection from "@/components/sections/HeroSection";
import TelemetryStrip from "@/components/sections/TelemetryStrip";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import StackSection from "@/components/sections/StackSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Telemetry strip ── */}
      <TelemetryStrip />

      <div className="section-divider" />

      {/* ── Projects ── */}
      <ProjectsSection />

      <div className="section-divider" />

      {/* ── Experience ── */}
      <ExperienceTimeline />

      <div className="section-divider" />

      {/* ── Stack + Credentials ── */}
      <StackSection />

      <div className="section-divider" />

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}
