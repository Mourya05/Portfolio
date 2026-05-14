import ExperienceTimeline from "@/components/sections/ExperienceTimeline";

export const metadata = {
  title: "Experience | Mourya's Domain",
  description:
    "A cybernetic deployment log of Mourya Birru's professional experiences, internships, and technical roles.",
};

export default function ExperiencePage() {
  return (
    <main className="relative w-full flex flex-col pt-10">
      <ExperienceTimeline />
    </main>
  );
}
