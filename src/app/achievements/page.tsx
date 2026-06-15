import type { Metadata } from "next";
import AchievementsSection from "@/components/sections/AchievementsSection";

export const metadata: Metadata = {
  title: "Achievements | Mourya Birru",
  description:
    "Competitive record and achievements of Mourya Birru — GATE 2026 AIR 9602, IEEE Xtreme Global Rank 542, hackathon wins, and institutional rank holders.",
};

export default function AchievementsPage() {
  return (
    <main className="relative w-full flex flex-col pt-10">
      <AchievementsSection />
    </main>
  );
}
